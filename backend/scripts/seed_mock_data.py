import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database.realtime_db import realtime_db

def seed_mock_data():
    print("Seeding mock analytics...")
    realtime_db.update_analytics({
        "totalUploads": 124,
        "processedDocuments": 124,
        "knowledgeConnections": 892,
        "keywordsExtracted": 3450,
        "documentTypes": {
            "pdf": 80,
            "csv": 24,
            "txt": 20
        }
    })

    print("Seeding mock knowledge graph...")
    realtime_db.update_graph({
        "nodes": [
            { "id": 'doc_1', "position": { "x": 250, "y": 100 }, "data": { "label": 'Q3 Financial Report.pdf' }, "type": 'default', "style": { "background": 'rgba(59, 130, 246, 0.2)', "color": 'white', "border": '1px solid #3b82f6', "borderRadius": '8px', "padding": '10px' } },
            { "id": 'doc_2', "position": { "x": 550, "y": 150 }, "data": { "label": 'Climate Study 2025.csv' }, "style": { "background": 'rgba(59, 130, 246, 0.2)', "color": 'white', "border": '1px solid #3b82f6', "borderRadius": '8px', "padding": '10px' } },
            { "id": 'kw_1', "position": { "x": 400, "y": 250 }, "data": { "label": '#Revenue' }, "style": { "background": 'rgba(168, 85, 247, 0.2)', "color": 'white', "border": '1px solid #a855f7', "borderRadius": '20px', "padding": '8px 16px' } },
            { "id": 'kw_2', "position": { "x": 300, "y": 350 }, "data": { "label": '#Renewable Energy' }, "style": { "background": 'rgba(168, 85, 247, 0.2)', "color": 'white', "border": '1px solid #a855f7', "borderRadius": '20px', "padding": '8px 16px' } },
            { "id": 'kw_3', "position": { "x": 600, "y": 250 }, "data": { "label": '#Emissions' }, "style": { "background": 'rgba(168, 85, 247, 0.2)', "color": 'white', "border": '1px solid #a855f7', "borderRadius": '20px', "padding": '8px 16px' } }
        ],
        "edges": [
            { "id": 'e1-k1', "source": 'doc_1', "target": 'kw_1', "animated": True, "style": { "stroke": '#60a5fa' } },
            { "id": 'e1-k2', "source": 'doc_1', "target": 'kw_2', "animated": True, "style": { "stroke": '#60a5fa' } },
            { "id": 'e2-k2', "source": 'doc_2', "target": 'kw_2', "animated": True, "style": { "stroke": '#c084fc' } },
            { "id": 'e2-k3', "source": 'doc_2', "target": 'kw_3', "animated": True, "style": { "stroke": '#c084fc' } },
        ]
    })
    
    print("Seeding mock documents...")
    # Just one example document
    realtime_db.create_document({
        "title": "Q3 Financial Report.pdf",
        "fileType": "pdf",
        "processingStatus": "completed",
        "uploadedAt": "2025-01-10T10:00:00Z",
        "keywords": ["Revenue", "Renewable Energy"],
        "documentInsights": {
            "word_count": 12500,
            "reading_time_minutes": 62,
            "top_keywords": ["Revenue", "Growth", "Q3", "Renewable Energy", "Expenditure"]
        }
    })

    print("Mock data seeded successfully!")

if __name__ == "__main__":
    seed_mock_data()
