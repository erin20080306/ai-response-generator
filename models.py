from datetime import datetime
from flask_login import UserMixin
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey
import uuid

# 模型定義，使用 Column 而非 db.Column
class User(UserMixin):
    __tablename__ = 'users'
    
    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(80), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(256))
    theme = Column(String(20), default='dark')
    font_size = Column(String(10), default='medium')
    typing_speed = Column(Integer, default=50)
    ai_tone = Column(String(20), default='friendly')
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 關聯會在 init_db 時設置
    conversations = None
    bookmarks = None
    shared_conversations = None

class Conversation:
    __tablename__ = 'conversations'
    
    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(50), ForeignKey('users.id'), nullable=True)
    title = Column(String(200), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_archived = Column(Boolean, default=False)
    
    # 關聯
    user = None
    messages = None

class Message:
    __tablename__ = 'messages'
    
    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String(50), ForeignKey('conversations.id'), nullable=False)
    content = Column(Text, nullable=False)
    role = Column(String(20), nullable=False)  # 'user' or 'assistant'
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # 關聯
    conversation = None

class Bookmark:
    __tablename__ = 'bookmarks'
    
    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(50), ForeignKey('users.id'), nullable=False)
    conversation_id = Column(String(50), ForeignKey('conversations.id'), nullable=False)
    title = Column(String(200), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 關聯
    user = None
    conversation = None

class SharedConversation:
    __tablename__ = 'shared_conversations'
    
    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(50), ForeignKey('users.id'), nullable=False)
    conversation_id = Column(String(50), ForeignKey('conversations.id'), nullable=False)
    share_token = Column(String(100), unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 關聯
    user = None
    conversation = None

class QuickReply:
    __tablename__ = 'quick_replies'
    
    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(50), ForeignKey('users.id'), nullable=True)
    title = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    is_global = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 關聯
    user = None

class FileUpload:
    __tablename__ = 'file_uploads'
    
    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(50), ForeignKey('users.id'), nullable=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    analysis_result = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 關聯
    user = None



def init_db(db):
    """初始化資料庫模型"""
    # 重新定義所有模型繼承自 db.Model
    global User, Conversation, Message, Bookmark, SharedConversation
    global QuickReply, FileUpload, CollaborationRoom, RoomParticipant
    
    class User(UserMixin, db.Model):
        __tablename__ = 'users'
        
        id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
        username = db.Column(db.String(80), unique=True, nullable=False)
        email = db.Column(db.String(120), unique=True, nullable=False)
        password_hash = db.Column(db.String(256))
        theme = db.Column(db.String(20), default='dark')
        font_size = db.Column(db.String(10), default='medium')
        typing_speed = db.Column(db.Integer, default=50)
        ai_tone = db.Column(db.String(20), default='friendly')
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        
        # 關聯
        conversations = relationship('Conversation', back_populates='user', cascade='all, delete-orphan')
        bookmarks = relationship('Bookmark', back_populates='user', cascade='all, delete-orphan')
        shared_conversations = relationship('SharedConversation', back_populates='user', cascade='all, delete-orphan')

    class Conversation(db.Model):
        __tablename__ = 'conversations'
        
        id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
        user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=True)
        title = db.Column(db.String(200), nullable=False)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
        is_archived = db.Column(db.Boolean, default=False)
        
        # 關聯
        user = relationship('User', back_populates='conversations')
        messages = relationship('Message', back_populates='conversation', cascade='all, delete-orphan')

    class Message(db.Model):
        __tablename__ = 'messages'
        
        id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
        conversation_id = db.Column(db.String(50), db.ForeignKey('conversations.id'), nullable=False)
        content = db.Column(db.Text, nullable=False)
        role = db.Column(db.String(20), nullable=False)  # 'user' or 'assistant'
        timestamp = db.Column(db.DateTime, default=datetime.utcnow)
        
        # 關聯
        conversation = relationship('Conversation', back_populates='messages')

    class Bookmark(db.Model):
        __tablename__ = 'bookmarks'
        
        id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
        user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)
        conversation_id = db.Column(db.String(50), db.ForeignKey('conversations.id'), nullable=False)
        title = db.Column(db.String(200), nullable=False)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        
        # 關聯
        user = relationship('User', back_populates='bookmarks')
        conversation = relationship('Conversation')

    class SharedConversation(db.Model):
        __tablename__ = 'shared_conversations'
        
        id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
        user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)
        conversation_id = db.Column(db.String(50), db.ForeignKey('conversations.id'), nullable=False)
        share_token = db.Column(db.String(100), unique=True, nullable=False)
        expires_at = db.Column(db.DateTime, nullable=True)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        
        # 關聯
        user = relationship('User', back_populates='shared_conversations')
        conversation = relationship('Conversation')

    class QuickReply(db.Model):
        __tablename__ = 'quick_replies'
        
        id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
        user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=True)
        title = db.Column(db.String(100), nullable=False)
        content = db.Column(db.Text, nullable=False)
        category = db.Column(db.String(50), nullable=False)
        is_global = db.Column(db.Boolean, default=False)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        
        # 關聯
        user = relationship('User')

    class FileUpload(db.Model):
        __tablename__ = 'file_uploads'
        
        id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
        user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=True)
        filename = db.Column(db.String(255), nullable=False)
        original_filename = db.Column(db.String(255), nullable=False)
        file_path = db.Column(db.String(500), nullable=False)
        file_type = db.Column(db.String(100), nullable=False)
        file_size = db.Column(db.Integer, nullable=False)
        analysis_result = db.Column(db.Text, nullable=True)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        
        # 關聯
        user = relationship('User')


    
    # 返回所有模型類別
    return {
        'User': User,
        'Conversation': Conversation,
        'Message': Message,
        'Bookmark': Bookmark,
        'SharedConversation': SharedConversation,
        'QuickReply': QuickReply,
        'FileUpload': FileUpload
    }