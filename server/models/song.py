from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Song(Base):
    __tablename__ = 'songs'

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    artist = Column(String(255), nullable=False)
    chords = Column(Text, nullable=False)

    def __repr__(self):
        return f"<Song(title='{self.title}', artist='{self.artist}', chords='{self.chords}')>"