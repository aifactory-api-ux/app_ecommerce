import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.config import get_settings
from app.models.product import Product, ProductType
from app.models.user import User
from app.services.auth_service import AuthService

settings = get_settings()


SAMPLE_PRODUCTS = [
    {
        "name": "Visual Studio Code",
        "slug": "visual-studio-code",
        "description": "Editor de código más popular del mundo. Ligero, potente y extensible.",
        "price": 0.00,
        "product_type": ProductType.SOFTWARE,
        "file_url": "https://code.visualstudio.com/",
        "stock": -1,
    },
    {
        "name": "PyCharm Professional",
        "slug": "pycharm-professional",
        "description": "IDE profesional para desarrollo Python con soporte completo para frameworks web.",
        "price": 29.99,
        "product_type": ProductType.LICENSE,
        "file_url": "license-key",
        "stock": -1,
    },
    {
        "name": "JetBrains All Products Pack",
        "slug": "jetbrains-all-products",
        "description": "Acceso a todas las herramientas de desarrollo de JetBrains por un año.",
        "price": 249.99,
        "product_type": ProductType.SUBSCRIPTION,
        "file_url": "license-key",
        "stock": -1,
    },
    {
        "name": "React Complete Guide",
        "slug": "react-complete-guide",
        "description": "Curso completo de React 18 desde cero a avanzado. 40+ horas de contenido.",
        "price": 49.99,
        "product_type": ProductType.DOWNLOAD,
        "file_url": "https://example.com/download/react-guide.pdf",
        "stock": -1,
    },
    {
        "name": "GitHub Copilot",
        "slug": "github-copilot",
        "description": "Asistente de IA para programadores. Autocompletado inteligente.",
        "price": 19.99,
        "product_type": ProductType.SUBSCRIPTION,
        "file_url": "license-key",
        "stock": -1,
    },
    {
        "name": "Docker Desktop",
        "slug": "docker-desktop",
        "description": "Plataforma de contenedores más popular para desarrolladores.",
        "price": 0.00,
        "product_type": ProductType.SOFTWARE,
        "file_url": "https://docker.com/products/docker-desktop",
        "stock": -1,
    },
    {
        "name": "Postman Professional",
        "slug": "postman-professional",
        "description": "Herramienta completa para testing de APIs REST y GraphQL.",
        "price": 29.99,
        "product_type": ProductType.LICENSE,
        "file_url": "license-key",
        "stock": -1,
    },
    {
        "name": "Notion Premium",
        "slug": "notion-premium",
        "description": "Espacio de trabajo todo-en-uno para equipos y individuals.",
        "price": 16.00,
        "product_type": ProductType.SUBSCRIPTION,
        "file_url": "license-key",
        "stock": -1,
    },
    {
        "name": "Figma Professional",
        "slug": "figma-professional",
        "description": "Herramienta de diseño colaborativo basada en la nube.",
        "price": 45.00,
        "product_type": ProductType.SUBSCRIPTION,
        "file_url": "license-key",
        "stock": -1,
    },
    {
        "name": "AWS Solutions Architect Course",
        "slug": "aws-solutions-architect",
        "description": "Preparación completa para certificación AWS Solutions Architect Associate.",
        "price": 89.99,
        "product_type": ProductType.DOWNLOAD,
        "file_url": "https://example.com/download/aws-course.zip",
        "stock": -1,
    },
    {
        "name": "Tailwind CSS Masterclass",
        "slug": "tailwind-css-masterclass",
        "description": "Domina Tailwind CSS con proyectos del mundo real.",
        "price": 34.99,
        "product_type": ProductType.DOWNLOAD,
        "file_url": "https://example.com/download/tailwind-course.zip",
        "stock": -1,
    },
    {
        "name": "Python for Data Science",
        "slug": "python-data-science",
        "description": "Curso completo de Python para ciencia de datos con pandas, numpy y matplotlib.",
        "price": 59.99,
        "product_type": ProductType.DOWNLOAD,
        "file_url": "https://example.com/download/python-ds.zip",
        "stock": -1,
    },
]


async def seed_database():
    engine = create_async_engine(settings.DATABASE_URL, echo=True)

    async with engine.begin() as conn:
        from app.database import Base
        await conn.run_sync(Base.metadata.create_all)

    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        from sqlalchemy import select

        result = await session.execute(select(Product).limit(1))
        if result.scalar_one_or_none():
            print("Database already seeded. Skipping...")
            return

        print("Seeding products...")
        for product_data in SAMPLE_PRODUCTS:
            product = Product(**product_data)
            session.add(product)

        print("Creating admin user...")
        import uuid
        admin = User(
            id=uuid.uuid4(),
            email=settings.ADMIN_EMAIL,
            password_hash=AuthService.hash_password(AuthService, settings.ADMIN_PASSWORD),
            full_name="Admin User",
            is_verified=True,
        )
        session.add(admin)

        await session.commit()
        print(f"Seeded {len(SAMPLE_PRODUCTS)} products and admin user")
        print(f"Admin login: {settings.ADMIN_EMAIL} / {settings.ADMIN_PASSWORD}")


if __name__ == "__main__":
    asyncio.run(seed_database())
