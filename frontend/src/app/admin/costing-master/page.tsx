'use client';

import React, { useState, useEffect } from 'react';
import { Save, FileJson, AlertTriangle } from 'lucide-react';
import { API_URL } from '@/lib/api';

const COSTING_TEMPLATE = {
  "dishes": [
    {
      "dishName": "Example Dish",
      "category": "Starter",
      "ingredients": [
        {
          "name": "Chicken",
          "quantity": 200,
          "unit": "g",
          "rateUnit": "kg",
          "purchasePrice": 250
        }
      ],
      "packaging": {
        "dineIn": [],
        "takeaway": [
          {
            "name": "Container",
            "quantity": 1,
            "price": 10
          }
        ]
      },
      "suggestedPrice": 300
    }
  ]
};

export default function CostingMasterAdmin() {
  const [costingMasterJson, setCostingMasterJson] = useState('{\n  \n}');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/settings/costing_master`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) return null;
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setCostingMasterJson(JSON.stringify(data, null, 2));
        }
      })
      .catch(err => console.error('Failed to load costing master:', err));
  }, []);

  const handleSaveCostingMaster = async () => {
    try {
      setLoading(true);
      let parsedJson;
      try {
        parsedJson = JSON.parse(costingMasterJson);
      } catch (e) {
        alert('Invalid JSON format. Please check your syntax.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/settings/costing_master`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ value: parsedJson })
      });
      
      if (res.ok) {
        alert('Costing Master updated successfully!');
      } else {
        const errText = await res.text();
        alert(`Failed to update costing master. Error: ${errText}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating costing master');
    } finally {
      setLoading(false);
    }
  };

  const loadTemplate = () => {
    setCostingMasterJson(JSON.stringify(COSTING_TEMPLATE, null, 2));
  };

  return (
    <div className="space-y-10 p-8 pb-20 max-w-7xl mx-auto">
      <header>
        <div className="flex items-center gap-3 text-gold text-xs font-black uppercase tracking-[0.3em] mb-3">
          <span className="w-8 h-[1px] bg-gold"></span>
          Costing Master
        </div>
        <h1 className="text-4xl font-black tracking-tighter">COSTING <span className="text-gold">MASTER</span></h1>
        <p className="text-foreground/40 text-sm mt-2 font-medium">Define the global JSON template for dish costings that will be accessible to all restaurant users.</p>
      </header>

      <div className="bg-card glass-card rounded-[2.5rem] border border-foreground/5 p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-black text-foreground uppercase tracking-widest mb-2">Global Costing Master JSON</h4>
              <p className="text-foreground/40 text-xs">This JSON data will be accessible to all restaurant users in their Costing Master section.</p>
            </div>
            <button 
              onClick={loadTemplate}
              className="px-6 py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 border border-foreground/10"
            >
              <FileJson size={14} /> Load Template
            </button>
          </div>
          
          <textarea
            value={costingMasterJson}
            onChange={(e) => setCostingMasterJson(e.target.value)}
            className="w-full h-[500px] bg-foreground/5 border border-foreground/10 rounded-xl p-6 text-sm font-mono text-green-600 dark:text-green-400 focus:outline-none focus:border-gold transition-all resize-y"
            placeholder="{\n  // Enter valid JSON here\n}"
            spellCheck={false}
          />
          
          <div className="flex justify-end">
            <button 
              onClick={handleSaveCostingMaster}
              disabled={loading}
              className="px-12 py-4 bg-gold-gradient text-black rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-gold/20 flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
            >
              <Save size={18} /> {loading ? 'Saving...' : 'Save JSON'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
