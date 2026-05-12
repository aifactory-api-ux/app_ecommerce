from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from app.database import get_db
from app.models.product import Product, ProductType
from app.models.user import User
from app.config import get_settings

router = APIRouter()
settings = get_settings()


SAMPLE_PRODUCTS = [
    {
        "name": "Visual Studio Code",
        "slug": "visual-studio-code",
        "description": "Editor de código más popular del mundo. Ligero, potente y extensible.",
        "price": 0.00,
        "product_type": ProductType.SOFTWARE,
        "file_url": "https://code.visualstudio.com/",
    },
    {
        "name": "PyCharm Professional",
        "slug": "pycharm-professional",
        "description": "IDE profesional para desarrollo Python con soporte completo para frameworks web.",
        "price": 29.99,
        "product_type": ProductType.LICENSE,
        "file_url": "license-key",
    },
    {
        "name": "JetBrains All Products Pack",
        "slug": "jetbrains-all-products",
        "description": "Acceso a todas las herramientas de desarrollo de JetBrains por un año.",
        "price": 249.99,
        "product_type": ProductType.SUBSCRIPTION,
        "file_url": "license-key",
    },
    {
        "name": "React Complete Guide",
        "slug": "react-complete-guide",
        "description": "Curso completo de React 18 desde cero a avanzado. 40+ horas de contenido.",
        "price": 49.99,
        "product_type": ProductType.DOWNLOAD,
        "file_url": "https://example.com/download/react-guide.zip",
    },
    {
        "name": "GitHub Copilot",
        "slug": "github-copilot",
        "description": "Asistente de IA para programadores. Autocompletado inteligente.",
        "price": 19.99,
        "product_type": ProductType.SUBSCRIPTION,
        "file_url": "license-key",
    },
    {
        "name": "Docker Desktop",
        "slug": "docker-desktop",
        "description": "Plataforma de contenedores más popular para desarrolladores.",
        "price": 0.00,
        "product_type": ProductType.SOFTWARE,
        "file_url": "https://docker.com/products/docker-desktop",
    },
    {
        "name": "Postman Professional",
        "slug": "postman-professional",
        "description": "Herramienta completa para testing de APIs REST y GraphQL.",
        "price": 29.99,
        "product_type": ProductType.LICENSE,
        "file_url": "license-key",
    },
    {
        "name": "Notion Premium",
        "slug": "notion-premium",
        "description": "Espacio de trabajo todo-en-uno para equipos y individuals.",
        "price": 16.00,
        "product_type": ProductType.SUBSCRIPTION,
        "file_url": "license-key",
    },
    {
        "name": "Figma Professional",
        "slug": "figma-professional",
        "description": "Herramienta de diseño colaborativo basada en la nube.",
        "price": 45.00,
        "product_type": ProductType.SUBSCRIPTION,
        "file_url": "license-key",
    },
    {
        "name": "AWS Solutions Architect Course",
        "slug": "aws-solutions-architect",
        "description": "Preparación completa para certificación AWS Solutions Architect Associate.",
        "price": 89.99,
        "product_type": ProductType.DOWNLOAD,
        "file_url": "https://example.com/download/aws-course.zip",
    },
    {
        "name": "Tailwind CSS Masterclass",
        "slug": "tailwind-css-masterclass",
        "description": "Domina Tailwind CSS con proyectos del mundo real.",
        "price": 34.99,
        "product_type": ProductType.DOWNLOAD,
        "file_url": "https://example.com/download/tailwind-course.zip",
    },
    {
        "name": "Python for Data Science",
        "slug": "python-data-science",
        "description": "Curso completo de Python para ciencia de datos con pandas, numpy y matplotlib.",
        "price": 59.99,
        "product_type": ProductType.DOWNLOAD,
        "file_url": "https://example.com/download/python-ds.zip",
    },
]


@router.post("/seed")
async def seed_database(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).limit(1))
    if result.scalar_one_or_none():
        return {"message": "Database already seeded", "products_count": 0}

    for product_data in SAMPLE_PRODUCTS:
        product = Product(**product_data)
        db.add(product)

    import bcrypt
    password_hash = bcrypt.hashpw(settings.ADMIN_PASSWORD.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    admin = User(
        id=uuid.uuid4(),
        email=settings.ADMIN_EMAIL,
        password_hash=password_hash,
        full_name="Admin User",
        is_verified=True,
    )
    db.add(admin)

    await db.commit()

    return {
        "message": "Database seeded successfully",
        "products_count": len(SAMPLE_PRODUCTS),
        "admin_credentials": {
            "email": settings.ADMIN_EMAIL,
            "password": settings.ADMIN_PASSWORD,
        },
    }
