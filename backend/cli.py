import asyncio
import click
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
import bcrypt

from app.config import get_settings
from app.models.product import Product, ProductType
from app.models.user import User
from app.database import Base

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


@click.group()
def cli():
    """E-Commerce CLI Commands"""
    pass


@cli.command()
@click.option("--drop", is_flag=True, help="Drop all tables before creating")
def init_db(drop):
    """Initialize database tables"""
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL, echo=True)

    async def _init():
        async with engine.begin() as conn:
            if drop:
                click.echo("Dropping all tables...")
                await conn.run_sync(Base.metadata.drop_all)
            click.echo("Creating tables...")
            await conn.run_sync(Base.metadata.create_all)
        click.echo("Done!")

    asyncio.run(_init())


SAMPLE_PRODUCTS = [
    {"name": "Visual Studio Code", "slug": "visual-studio-code", "description": "Editor de código más popular del mundo.", "price": 0.00, "product_type": ProductType.SOFTWARE, "file_url": "https://code.visualstudio.com/"},
    {"name": "PyCharm Professional", "slug": "pycharm-professional", "description": "IDE profesional para desarrollo Python.", "price": 29.99, "product_type": ProductType.LICENSE, "file_url": "license-key"},
    {"name": "JetBrains All Products Pack", "slug": "jetbrains-all-products", "description": "Acceso a todas las herramientas JetBrains por un año.", "price": 249.99, "product_type": ProductType.SUBSCRIPTION, "file_url": "license-key"},
    {"name": "React Complete Guide", "slug": "react-complete-guide", "description": "Curso completo de React 18.", "price": 49.99, "product_type": ProductType.DOWNLOAD, "file_url": "https://example.com/react-guide.zip"},
    {"name": "GitHub Copilot", "slug": "github-copilot", "description": "Asistente de IA para programadores.", "price": 19.99, "product_type": ProductType.SUBSCRIPTION, "file_url": "license-key"},
    {"name": "Docker Desktop", "slug": "docker-desktop", "description": "Plataforma de contenedores.", "price": 0.00, "product_type": ProductType.SOFTWARE, "file_url": "https://docker.com"},
    {"name": "Postman Professional", "slug": "postman-professional", "description": "Herramienta para testing de APIs.", "price": 29.99, "product_type": ProductType.LICENSE, "file_url": "license-key"},
    {"name": "Notion Premium", "slug": "notion-premium", "description": "Espacio de trabajo todo-en-uno.", "price": 16.00, "product_type": ProductType.SUBSCRIPTION, "file_url": "license-key"},
    {"name": "Figma Professional", "slug": "figma-professional", "description": "Herramienta de diseño colaborativo.", "price": 45.00, "product_type": ProductType.SUBSCRIPTION, "file_url": "license-key"},
    {"name": "AWS Solutions Architect", "slug": "aws-solutions-architect", "description": "Preparación para certificación AWS.", "price": 89.99, "product_type": ProductType.DOWNLOAD, "file_url": "https://example.com/aws-course.zip"},
    {"name": "Tailwind CSS Masterclass", "slug": "tailwind-css-masterclass", "description": "Domina Tailwind CSS.", "price": 34.99, "product_type": ProductType.DOWNLOAD, "file_url": "https://example.com/tailwind.zip"},
    {"name": "Python for Data Science", "slug": "python-data-science", "description": "Curso de Python para ciencia de datos.", "price": 59.99, "product_type": ProductType.DOWNLOAD, "file_url": "https://example.com/python-ds.zip"},
]


@cli.command()
def seed():
    """Seed database with sample products and admin user"""
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL, echo=False)

    async def _seed():
        from sqlalchemy import select

        async with async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)() as session:
            result = await session.execute(select(Product).limit(1))
            if result.scalar_one_or_none():
                click.echo("Database already seeded. Skipping...")
                return

            click.echo("Seeding products...")
            for product_data in SAMPLE_PRODUCTS:
                product = Product(**product_data)
                session.add(product)

            click.echo("Creating admin user...")
            import uuid
            admin = User(
                id=uuid.uuid4(),
                email=settings.ADMIN_EMAIL,
                password_hash=hash_password(settings.ADMIN_PASSWORD),
                full_name="Admin User",
                is_verified=True,
            )
            session.add(admin)

            await session.commit()
            click.echo(f"Seeded {len(SAMPLE_PRODUCTS)} products and admin user")
            click.echo(f"Admin login: {settings.ADMIN_EMAIL} / {settings.ADMIN_PASSWORD}")

    asyncio.run(_seed())


if __name__ == "__main__":
    cli()
