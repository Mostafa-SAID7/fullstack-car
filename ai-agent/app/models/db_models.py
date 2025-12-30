from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from app.core.database import Base
from datetime import datetime

class Vehicle(Base):
    __tablename__ = "Vehicles"
    # Assuming standard entity columns based on common .NET patterns
    # Adjust column names if they differ in the actual DB
    Id = Column(Integer, primary_key=True, index=True)
    Make = Column(String)
    Model = Column(String)
    Year = Column(Integer)
    Price = Column(Float)
    Description = Column(String, nullable=True)
    Mileage = Column(Integer, nullable=True)
    IsSold = Column(Boolean, default=False)

class Post(Base):
    __tablename__ = "Posts"
    Id = Column(Integer, primary_key=True, index=True)
    Content = Column(String)
    Created = Column(DateTime, default=datetime.utcnow)
    UserId = Column(String)
