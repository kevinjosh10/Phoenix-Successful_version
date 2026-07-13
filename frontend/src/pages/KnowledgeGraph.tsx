import { useEffect, useState } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  MiniMap
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../services/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Hash } from 'lucide-react';

export const KnowledgeGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  useEffect(() => {
    const graphRef = ref(rtdb, 'graph/main');
    const unsubscribe = onValue(graphRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.nodes) {
          setNodes(data.nodes.map((n: any) => ({
            id: n.id,
            position: n.position || { x: Math.random() * 500, y: Math.random() * 500 },
            data: { label: n.label || n.data?.label || 'Node' },
            type: n.type || 'default',
            style: n.style || (n.id.startsWith('doc') 
              ? { background: 'rgba(59, 130, 246, 0.2)', color: 'white', border: '1px solid #3b82f6', borderRadius: '8px', padding: '10px' }
              : { background: 'rgba(168, 85, 247, 0.2)', color: 'white', border: '1px solid #a855f7', borderRadius: '20px', padding: '8px 16px' })
          })));
        }
        if (data.edges) {
          setEdges(data.edges.map((e: any) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            animated: e.animated !== undefined ? e.animated : true,
            style: e.style || { stroke: '#60a5fa' }
          })));
        }
      }
    });

    return () => unsubscribe();
  }, [setNodes, setEdges]);

  return (
    <div className="h-[800px] w-full glass-panel rounded-3xl overflow-hidden border border-card-border relative">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h2 className="text-2xl font-bold text-white mb-1">Knowledge Graph</h2>
        <p className="text-muted-foreground text-sm">Interactive view of document relationships</p>
      </div>
      
      <div className="absolute bottom-6 left-6 z-10 flex gap-4 pointer-events-none">
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-white font-medium">Documents</span>
        </div>
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-sm text-white font-medium">Keywords</span>
        </div>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-6 right-6 z-20 w-80 bg-[#1e1e24]/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-white pr-4 leading-tight">{selectedNode.data.label}</h3>
              <button onClick={() => setSelectedNode(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2 bg-white/5 rounded-lg text-primary">
                  {selectedNode.id.startsWith('doc') ? <FileText size={18} /> : <Hash size={18} />}
                </div>
                <div className="text-sm font-medium">
                  {selectedNode.id.startsWith('doc') ? 'Document Node' : 'Keyword Node'}
                </div>
              </div>
              
              <div className="p-4 bg-white/5 rounded-xl text-sm text-white/80 font-mono break-all">
                <span className="font-semibold text-white/60">ID:</span> {selectedNode.id}
              </div>
              
              <p className="text-sm text-muted-foreground pt-2 border-t border-white/5 leading-relaxed">
                {selectedNode.id.startsWith('doc') 
                  ? "This document was successfully processed and connected within the knowledge graph. Click on connected keywords to explore related documents." 
                  : "This keyword connects multiple documents that share highly related contexts and topics within your dataset."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => setSelectedNode(node)}
        fitView
        className="bg-background/50"
      >
        <Background color="#333" gap={20} size={1} />
        <Controls className="bg-white/10 fill-white text-white border-white/20" />
        <MiniMap 
          nodeColor={(node) => {
            if (node.id.startsWith('doc')) return '#3b82f6';
            return '#a855f7';
          }}
          maskColor="rgba(0,0,0,0.5)"
          className="bg-black/50 border border-white/10 rounded-xl"
        />
      </ReactFlow>
    </div>
  );
};
