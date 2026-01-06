from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import json
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import time
from openai import OpenAI


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# OpenAI client with Emergent LLM Key - initialized lazily
openai_client = None

def get_openai_client():
    global openai_client
    if openai_client is None:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            raise ValueError("EMERGENT_LLM_KEY not set")
        openai_client = OpenAI(
            api_key=api_key,
            base_url="https://llm.emergentagi.com/v1"
        )
    return openai_client

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Dashboard Metrics Model
class DashboardMetrics(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    corrections: int = 0  # One-Shot Fixes gerados
    designs: int = 0      # Designs criados no Laboratório
    saved: int = 0        # Itens salvos no histórico
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Tool Model
class Tool(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    name: str
    description: str
    icon: str
    color: str
    available: bool = True

# User Model
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    avatar: str

# Error Analysis Request Model
class ErrorAnalysisRequest(BaseModel):
    error_log: str
    tags: List[str] = []

# Error Analysis Response Model
class ErrorAnalysisResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    log_id: str
    timestamp: str
    framework: str
    severity: str
    tokens_used: int
    processing_time: str
    root_cause: str
    root_cause_description: str
    solution: str
    prompt: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "AI Assistant Dashboard API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Dashboard API endpoints
@api_router.get("/dashboard/metrics", response_model=DashboardMetrics)
async def get_dashboard_metrics():
    """Get dashboard metrics"""
    # Try to get from database or return default values
    metrics = await db.dashboard_metrics.find_one({}, {"_id": 0})
    
    if metrics:
        if isinstance(metrics.get('updated_at'), str):
            metrics['updated_at'] = datetime.fromisoformat(metrics['updated_at'])
        return metrics
    
    # Return default metrics if none exist
    default_metrics = DashboardMetrics()
    return default_metrics

@api_router.get("/dashboard/user", response_model=User)
async def get_current_user():
    """Get current user information"""
    return User(
        id="user-1",
        name="Rodzigor",
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Rodzigor&backgroundColor=b6e3f4"
    )

@api_router.get("/dashboard/tools", response_model=List[Tool])
async def get_available_tools():
    """Get list of available tools"""
    tools = [
        Tool(
            id="tool-1",
            name="Correções de uso único",
            description="Transforme logs de erros complexos em prompts de correção claros instantaneamente.",
            icon="wand",
            color="purple",
            available=True
        ),
        Tool(
            id="tool-2",
            name="Laboratório de Design",
            description="Crie interfaces digitais completas usando IA. Landing pages, componentes e telas de app.",
            icon="star",
            color="red",
            available=True
        )
    ]
    return tools

@api_router.post("/dashboard/tool/{tool_id}/open")
async def open_tool(tool_id: str):
    """Record tool opening event"""
    tool_event = {
        "id": str(uuid.uuid4()),
        "tool_id": tool_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "action": "open"
    }
    await db.tool_events.insert_one(tool_event)
    return {"success": True, "message": f"Tool {tool_id} opened"}

# One-Shot Fixes - Error Analysis Endpoint
@api_router.post("/analyze-error", response_model=ErrorAnalysisResponse)
async def analyze_error(request: ErrorAnalysisRequest):
    """Analyze error log and generate a perfect prompt for Lovable"""
    start_time = time.time()
    
    try:
        # System prompt for the AI to act as a Lovable expert
        system_prompt = """Você é um especialista em desenvolvimento web e na plataforma Lovable. Sua tarefa é analisar logs de erro e gerar prompts perfeitos para corrigir erros na plataforma Lovable.

Você deve retornar uma resposta em formato JSON com a seguinte estrutura EXATA (sem markdown, apenas JSON puro):
{
    "framework": "Nome do framework detectado (ex: React, Next.js 14, Vue.js, etc)",
    "severity": "Baixa, Média ou Alta",
    "root_cause": "Título curto da causa raiz (ex: Hydration Mismatch, TypeError, etc)",
    "root_cause_description": "Explicação detalhada da causa raiz em português, explicando por que o erro ocorre. Use `código` para destacar termos técnicos.",
    "solution": "Explicação da solução em português, descrevendo como o prompt vai resolver o problema. Use `código` para destacar termos técnicos.",
    "prompt": "O prompt perfeito e completo para colar no Lovable. Deve ser estruturado, claro e incluir: contexto, instruções de correção numeradas, código problemático detectado e formato de saída esperado."
}

Regras importantes:
1. O prompt gerado deve ser específico para o erro analisado
2. Use português brasileiro para as explicações
3. O prompt pode ser em português ou inglês (prefira inglês para melhor compatibilidade)
4. Seja técnico mas educativo nas explicações
5. Identifique o framework baseado no erro
6. Avalie a gravidade baseada no impacto do erro
7. RETORNE APENAS O JSON, SEM TEXTO ANTES OU DEPOIS"""

        # User message with the error log
        user_message = f"""Analise o seguinte log de erro e gere um diagnóstico completo:

LOG DE ERRO:
{request.error_log}

TAGS DE CONTEXTO: {', '.join(request.tags) if request.tags else 'Nenhuma'}

Retorne APENAS o JSON com a análise, sem nenhum texto adicional."""

        # Call OpenAI API
        client = get_openai_client()
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        # Parse the response
        ai_response = response.choices[0].message.content.strip()
        
        # Remove markdown code blocks if present
        if ai_response.startswith("```"):
            ai_response = ai_response.split("```")[1]
            if ai_response.startswith("json"):
                ai_response = ai_response[4:]
        if ai_response.endswith("```"):
            ai_response = ai_response[:-3]
        
        analysis = json.loads(ai_response.strip())
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        # Calculate tokens used
        tokens_used = response.usage.total_tokens if response.usage else 0
        
        # Generate log ID
        log_id = f"#{uuid.uuid4().hex[:4].upper()}-{chr(65 + (int(time.time()) % 26))}"
        
        # Update metrics in database
        await db.dashboard_metrics.update_one(
            {},
            {
                "$inc": {"corrections": 1},
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
            },
            upsert=True
        )
        
        # Save analysis to database
        analysis_doc = {
            "id": str(uuid.uuid4()),
            "log_id": log_id,
            "error_log": request.error_log,
            "tags": request.tags,
            "analysis": analysis,
            "tokens_used": tokens_used,
            "processing_time": f"{processing_time:.1f}s",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.error_analyses.insert_one(analysis_doc)
        
        return ErrorAnalysisResponse(
            log_id=log_id,
            timestamp=datetime.now(timezone.utc).strftime("%d/%m/%Y %H:%M"),
            framework=analysis.get("framework", "Não detectado"),
            severity=analysis.get("severity", "Média"),
            tokens_used=tokens_used,
            processing_time=f"{processing_time:.1f}s",
            root_cause=analysis.get("root_cause", "Erro Desconhecido"),
            root_cause_description=analysis.get("root_cause_description", "Não foi possível determinar a causa raiz."),
            solution=analysis.get("solution", "Não foi possível gerar uma solução."),
            prompt=analysis.get("prompt", "Não foi possível gerar o prompt.")
        )
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e}, Response: {ai_response}")
        raise HTTPException(status_code=500, detail="Erro ao processar resposta da IA")
    except Exception as e:
        logger.error(f"Error analyzing error: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao analisar: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
