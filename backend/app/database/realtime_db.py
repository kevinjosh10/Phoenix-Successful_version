import uuid
from app.firebase.config import rtdb
from app.models.domain import Document, Analytics, Graph
from typing import List, Optional

class RealtimeDBClient:
    def __init__(self):
        # rtdb is the root reference '/'
        self.docs_ref = rtdb.child('documents')
        self.analytics_ref = rtdb.child('analytics')
        self.graph_ref = rtdb.child('graph')

    def create_document(self, doc_data: dict) -> str:
        # Generate a new ID if one isn't provided
        doc_id = doc_data.get('id', str(uuid.uuid4()))
        doc_data['id'] = doc_id
        
        self.docs_ref.child(doc_id).set(doc_data)
        return doc_id

    def get_document(self, doc_id: str) -> Optional[dict]:
        doc = self.docs_ref.child(doc_id).get()
        return doc

    def update_document(self, doc_id: str, updates: dict):
        self.docs_ref.child(doc_id).update(updates)
        
    def get_all_documents(self) -> List[dict]:
        docs = self.docs_ref.get()
        if docs:
            return list(docs.values())
        return []
        
    def get_analytics(self) -> dict:
        doc = self.analytics_ref.child('main').get()
        if doc:
            return doc
        return Analytics().model_dump()

    def update_analytics(self, updates: dict):
        self.analytics_ref.child('main').update(updates)
        
    def get_graph(self) -> dict:
        doc = self.graph_ref.child('main').get()
        if doc:
            return doc
        return Graph().model_dump()
        
    def update_graph(self, updates: dict):
        self.graph_ref.child('main').update(updates)

realtime_db = RealtimeDBClient()
