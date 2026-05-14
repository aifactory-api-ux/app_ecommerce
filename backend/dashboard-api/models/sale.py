from datetime import datetime, date
from sqlalchemy import String, DECIMAL, DateTime, Integer, func
from sqlalchemy.orm import Mapped, mapped_column
from dashboard_api.db.session import Base


class Sale(Base):
    __tablename__ = "sales"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(Integer, nullable=False)
    product_name: Mapped[str] = mapped_column(String(255), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    unit_price: Mapped[float] = mapped_column(DECIMAL(10, 2), nullable=False)
    total_price: Mapped[float] = mapped_column(DECIMAL(10, 2), nullable=False)
    sale_date: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)