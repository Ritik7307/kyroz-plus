'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  CheckCircle,
  Search,
  ChevronRight,
  Utensils,
  Settings,
  X,
  Edit,
  Save,
  Loader2,
  Image as ImageIcon,
  DollarSign,
  Upload,
  MessageCircle,
  Share2,
  Package,
  ChefHat,
  FileText,
  Percent,
  ChevronDown,
  Check,
  Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { API_URL } from '@/lib/api';
import { dataService } from '@/lib/dataService';
import { useTheme } from '@/context/ThemeContext';

const fetcher = (url: string) => {
  const token = localStorage.getItem('token');
  return dataService.get(url, { 'Authorization': `Bearer ${token}` });
};

interface Dish {
  _id: string;
  name: string;
  price: number;
  ingredientPrice: number;
  category: string;
  imageUrl?: string;
}

interface Dish {
  _id: string;
  name: string;
  price: number;
  ingredientPrice: number;
  category: string;
  imageUrl?: string;
}

interface TableSession {
  cart: { dish: Dish; quantity: number; note?: string }[];
  customerName: string;
  customerPhone: string;
  discount: string;
  discountType: 'percentage' | 'flat';
  additionalCharge: string;
  applyGst: boolean;
  paymentMethod: 'Cash' | 'Online' | 'Split';
  splitCash?: number;
  splitOnline?: number;
  orderType: 'DineIn' | 'Takeaway' | 'Delivery';
  kotStatus?: 'None' | 'Pending' | 'Preparing' | 'Ready' | 'Served';
  kotId?: string;
  sequenceNo?: string;
}

const INITIAL_TABLES = [
  { id: 'quick', name: 'Quick Bill' },
  { id: 'T1', name: 'Table 1' },
  { id: 'T2', name: 'Table 2' },
  { id: 'T3', name: 'Table 3' },
  { id: 'T4', name: 'Table 4' },
  { id: 'T5', name: 'Table 5' },
  { id: 'T6', name: 'Table 6' },
  { id: 'T7', name: 'Table 7' },
  { id: 'T8', name: 'Table 8' },
];

const getDevicePrefix = () => {
  if (typeof window === 'undefined') return '';
  let prefix = localStorage.getItem('kyroz_device_prefix');
  if (!prefix) {
    prefix = String.fromCharCode(
      65 + Math.floor(Math.random() * 26),
      65 + Math.floor(Math.random() * 26)
    );
    localStorage.setItem('kyroz_device_prefix', prefix);
  }
  return prefix;
};

const generateKotSequence = () => {
  if (typeof window === 'undefined') return 'KOT-1';
  const prefix = getDevicePrefix();
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const currentIST = new Date(now.getTime() + istOffset);
  const today = currentIST.toISOString().split('T')[0];
  
  const lastDate = localStorage.getItem('kyroz_kot_seq_date_v2');
  let seq = parseInt(localStorage.getItem('kyroz_kot_seq_v2') || '0', 10);
  
  if (lastDate !== today) {
    seq = 0;
    localStorage.setItem('kyroz_kot_seq_date_v2', today);
  }
  
  seq += 1;
  localStorage.setItem('kyroz_kot_seq_v2', seq.toString());
  return `${prefix}-${seq}`;
};

const generateBillSequence = () => {
  if (typeof window === 'undefined') return '1';
  const prefix = getDevicePrefix();
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const currentIST = new Date(now.getTime() + istOffset);
  const today = currentIST.toISOString().split('T')[0];
  
  const lastDate = localStorage.getItem('kyroz_seq_date_v2');
  let seq = parseInt(localStorage.getItem('kyroz_bill_seq_v2') || '0', 10);
  
  if (lastDate !== today) {
    seq = 0;
    localStorage.setItem('kyroz_seq_date_v2', today);
  }
  
  seq += 1;
  localStorage.setItem('kyroz_bill_seq_v2', seq.toString());
  return `${prefix}-${seq}`;
};

const defaultSession = (tableId: string): TableSession => ({
  cart: [],
  customerName: '',
  customerPhone: '',
  discount: '',
  discountType: 'percentage',
  additionalCharge: '',
  applyGst: true,
  paymentMethod: 'Cash',
  splitCash: 0,
  splitOnline: 0,
  orderType: tableId === 'quick' ? 'Takeaway' : 'DineIn',
  kotStatus: 'None',
  kotId: '',
  sequenceNo: undefined,
});

const DEFAULT_CATEGORIES = [
  'Cafe',
  'Chinese',
  'Biryani',
  'Mandi',
  'South Indian',
  'Indian Curry',
  'Tandoor'
];

export default function POSTerminal() {
  const { resolvedPosTheme } = useTheme();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cart, setCart] = useState<{ dish: Dish, quantity: number, note?: string, sentQty?: number, addons?: Dish[] }[]>([]);
  const [selectedGroupedDish, setSelectedGroupedDish] = useState<any>(null);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [selectedAddons, setSelectedAddons] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isManagementMode, setIsManagementMode] = useState(false);
  
  const { data: userData } = useSWR(`${API_URL}/api/auth/me`, fetcher);
  const { data: dishesData, isLoading: loadingDishes, mutate: mutateDishes } = useSWR(`${API_URL}/api/dishes`, fetcher);
  const { data: customersData } = useSWR(`${API_URL}/api/customers`, fetcher);
  const [user, setUser] = useState<any>(null);

  const [userRole, setUserRole] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isSavingDish, setIsSavingDish] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userQrCode, setUserQrCode] = useState<string | null>(null);
  const [userShopName, setUserShopName] = useState<string>('KYROZ POS');
  const [userGstRate, setUserGstRate] = useState<number>(5);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showShareMenuModal, setShowShareMenuModal] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [lastCheckoutData, setLastCheckoutData] = useState<any>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [printedBillNo, setPrintedBillNo] = useState<string>('');

  // Customer & Payment State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discount, setDiscount] = useState<string>(''); // Changed to string for better decimal handling
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [additionalCharge, setAdditionalCharge] = useState<string>('');
  const [modifierModalType, setModifierModalType] = useState<string | null>(null);
  const [applyGst, setApplyGst] = useState(true); // GST Toggle
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online' | 'Split'>('Cash');
  const [splitCash, setSplitCash] = useState<number>(0);
  const [splitOnline, setSplitOnline] = useState<number>(0);
  const [orderType, setOrderType] = useState<'DineIn' | 'Takeaway' | 'Delivery'>('DineIn');

  // KOT State
  const [kotStatus, setKotStatus] = useState<'None' | 'Pending' | 'Preparing' | 'Ready' | 'Served'>('None');
  const [kotId, setKotId] = useState<string>('');
  const [isSendingKot, setIsSendingKot] = useState(false);
  const [printType, setPrintType] = useState<'bill' | 'kot' | null>(null);
  const [printingKot, setPrintingKot] = useState<any | null>(null);

  // Table Billing State
  const [tables, setTables] = useState<{id: string, name: string}[]>(INITIAL_TABLES);
  const [activeTable, setActiveTable] = useState<string>('quick');
  const [tableSessions, setTableSessions] = useState<Record<string, TableSession>>({
    quick: defaultSession('quick'),
  });

  const isSwitchingTable = useRef(false);
  const activeTableRef = useRef<string>(activeTable);
  
  useEffect(() => {
    activeTableRef.current = activeTable;
  }, [activeTable]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [newDish, setNewDish] = useState({ name: '', price: '', ingredientPrice: '', category: 'Main Course', imageUrl: '' });
  const [hasVariations, setHasVariations] = useState(false);
  const [variations, setVariations] = useState<{name: string, price: string}[]>([{ name: 'Half', price: '' }, { name: 'Full', price: '' }]);
  const [advancedSetupData, setAdvancedSetupData] = useState({
    allowedWastagePercentage: 0,
    platesPerPacket: 10,
    totalPlates: 0,
    lowStockThreshold: 5,
    baseUnitName: 'Packet',
    subUnitName: 'Plate'
  });
  const [availableIngredients, setAvailableIngredients] = useState<any[]>([]);
  const [recipeIngredients, setRecipeIngredients] = useState<any[]>([]);
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>('');
  const [selectedTemplateDishId, setSelectedTemplateDishId] = useState<string>('');
  const [importingTemplate, setImportingTemplate] = useState(false);

  const handleImportTemplate = async (templateIdToImport?: string) => {
    const idToUse = typeof templateIdToImport === 'string' ? templateIdToImport : selectedTemplateDishId;
    if (!idToUse) return;
    setImportingTemplate(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/costing/dish/${idToUse}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch template costing');
      const data = await res.json();
      
      const newIngredients = data.ingredientsCostDetails
        .filter((ing: any) => !ing.isSubIngredient) // Only top-level items
        .map((ing: any) => {
          return {
            itemModel: ing.itemModel,
            itemId: ing.itemId,
            quantity: ing.quantity,
            unit: ing.unit,
            name: ing.name,
            costPerUnit: ing.purchasePrice // Assuming this gives unit cost
          };
        });

      setRecipeIngredients((prev) => {
        // Prevent duplicate ingredients if clicking multiple times
        const existingIds = new Set(prev.map(i => i.itemId));
        const filteredNew = newIngredients.filter((i: any) => !existingIds.has(i.itemId));
        return [...prev, ...filteredNew];
      });
      
      setNewDish((prev) => {
        const currentCost = Number(prev.ingredientPrice || 0);
        const addedCost = newIngredients.reduce((sum: number, item: any) => sum + (item.quantity * item.costPerUnit), 0);
        return { ...prev, ingredientPrice: String(currentCost + addedCost) };
      });
      
      if (typeof templateIdToImport !== 'string') {
        setSelectedTemplateCategory('');
        setSelectedTemplateDishId('');
      }
    } catch (err: any) {
      console.error('Failed to import template:', err);
      alert('Failed to import template: ' + err.message);
    } finally {
      setImportingTemplate(false);
    }
  };
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [ingredientUnit, setIngredientUnit] = useState('unit');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTable = () => {
    const tableName = prompt('Enter table name (e.g., VIP 1):');
    if (!tableName) return;
    const newId = 'T' + Date.now();
    const newTables = [...tables, { id: newId, name: tableName }];
    setTables(newTables);
    localStorage.setItem('pos_custom_tables', JSON.stringify(newTables));
    
    setTableSessions(prev => {
      const updated = { ...prev, [newId]: defaultSession(newId) };
      localStorage.setItem('pos_table_sessions', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveLastTable = () => {
    if (tables.length <= 1) return;
    const lastTable = tables[tables.length - 1];
    if (!confirm(`Are you sure you want to remove ${lastTable.name}? Any active order will be lost.`)) return;
    
    const newTables = tables.slice(0, -1);
    setTables(newTables);
    localStorage.setItem('pos_custom_tables', JSON.stringify(newTables));
    
    if (activeTable === lastTable.id) {
      switchTable('quick');
    }
  };

  const handleRemoveTable = (tableId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tableId === 'quick') return;
    if (!confirm('Are you sure you want to remove this table? Any active order will be lost.')) return;
    
    const newTables = tables.filter(t => t.id !== tableId);
    setTables(newTables);
    localStorage.setItem('pos_custom_tables', JSON.stringify(newTables));
    
    if (activeTable === tableId) {
      switchTable('quick');
    }
  };

  useEffect(() => {
    // Load custom tables
    const savedCustomTables = localStorage.getItem('pos_custom_tables');
    let loadedTables = INITIAL_TABLES;
    if (savedCustomTables) {
      try {
        loadedTables = JSON.parse(savedCustomTables);
        setTables(loadedTables);
      } catch (e) {
        console.error('Failed to load custom tables', e);
      }
    }

    // Load table sessions from localStorage
    const savedSessions = localStorage.getItem('pos_table_sessions');
    const savedActiveTable = localStorage.getItem('pos_active_table') || 'quick';
    
    let loadedSessions: Record<string, TableSession> = {};
    loadedTables.forEach(t => {
      loadedSessions[t.id] = defaultSession(t.id);
    });

    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        loadedSessions = { ...loadedSessions, ...parsed };
        setTableSessions(loadedSessions);
      } catch (e) {
        console.error('Failed to load table sessions', e);
      }
    }

    // Load active session into state
    const activeSession = loadedSessions[savedActiveTable] || defaultSession(savedActiveTable);
    isSwitchingTable.current = true;
    setActiveTable(savedActiveTable);
    setCart(activeSession.cart || []);
    setCustomerName(activeSession.customerName || '');
    setCustomerPhone(activeSession.customerPhone || '');
    setDiscount(activeSession.discount || '');
    setDiscountType(activeSession.discountType || 'percentage');
    setAdditionalCharge(activeSession.additionalCharge || '');
    setApplyGst(activeSession.applyGst !== undefined ? activeSession.applyGst : true);
    setPaymentMethod(activeSession.paymentMethod || 'Cash');
    setSplitCash(activeSession.splitCash || 0);
    setSplitOnline(activeSession.splitOnline || 0);
    setOrderType(activeSession.orderType || (savedActiveTable === 'quick' ? 'Takeaway' : 'DineIn'));
    setKotStatus(activeSession.kotStatus || 'None');
    setKotId(activeSession.kotId || '');
    
    // We don't load sequenceNo into a global state, it stays in tableSessions map.
    // Except, we need it when switching table. But we only need it when sending KOT or Checkout, which reads from tableSessions directly.

    setTimeout(() => {
      isSwitchingTable.current = false;
    }, 100);
  }, []);

  useEffect(() => {
    if (showAddModal) {
      fetchInventoryForCosting();
    }
  }, [showAddModal]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pos_table_sessions' && e.newValue) {
        try {
          const newSessions = JSON.parse(e.newValue);
          setTableSessions(newSessions);
          
          // If the active table was updated in another tab, sync our local states
          const currentTable = activeTableRef.current;
          if (newSessions[currentTable]) {
            const sess = newSessions[currentTable];
            isSwitchingTable.current = true;
            setCart(sess.cart || []);
            setCustomerName(sess.customerName || '');
            setCustomerPhone(sess.customerPhone || '');
            setDiscount(sess.discount || '');
            setDiscountType(sess.discountType || 'percentage');
            setAdditionalCharge(sess.additionalCharge || '');
            setApplyGst(sess.applyGst !== false);
            setPaymentMethod(sess.paymentMethod || 'Cash');
            setSplitCash(sess.splitCash || 0);
            setSplitOnline(sess.splitOnline || 0);
            setOrderType(sess.orderType || (currentTable === 'quick' ? 'Takeaway' : 'DineIn'));
            setKotStatus(sess.kotStatus || 'None');
            setKotId(sess.kotId || '');
            
            setTimeout(() => {
              isSwitchingTable.current = false;
            }, 100);
          }
        } catch (error) {
          console.error("Failed to parse cross-tab session sync", error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save current active table session to localStorage whenever states change
  useEffect(() => {
    if (isSwitchingTable.current) return;
    
    setTableSessions(prev => {
      const existingSeq = prev[activeTable]?.sequenceNo;
      const currentSession: TableSession = {
        cart,
        customerName,
        customerPhone,
        discount,
        discountType,
        additionalCharge,
        applyGst,
        paymentMethod,
        splitCash,
        splitOnline,
        orderType,
        kotStatus,
        kotId,
        sequenceNo: (cart.length === 0 && !customerName && !customerPhone) ? undefined : existingSeq, // Clear sequence number when order is completed/cleared
      };

      const updated = {
        ...prev,
        [activeTable]: currentSession
      };
      localStorage.setItem('pos_table_sessions', JSON.stringify(updated));
      return updated;
    });
  }, [cart, customerName, customerPhone, discount, discountType, additionalCharge, applyGst, paymentMethod, splitCash, splitOnline, orderType, kotStatus, kotId]);

  const switchTable = (targetTableId: string) => {
    isSwitchingTable.current = true;
    
    // Save current active states into current session
    const existingSeq = tableSessions[activeTable]?.sequenceNo;
    const currentSession: TableSession = {
      cart,
      customerName,
      customerPhone,
      discount,
      discountType,
      additionalCharge,
      applyGst,
      paymentMethod,
      splitCash,
      splitOnline,
      orderType,
      kotStatus,
      kotId,
      sequenceNo: (cart.length === 0 && !customerName && !customerPhone) ? undefined : existingSeq,
    };
    
    const updatedSessions: Record<string, TableSession> = {
      ...tableSessions,
      [activeTable]: currentSession
    };
    setTableSessions(updatedSessions);
    localStorage.setItem('pos_table_sessions', JSON.stringify(updatedSessions));
    
    // Load target session
    const targetSession = updatedSessions[targetTableId] || defaultSession(targetTableId);
    setCart(targetSession.cart || []);
    setCustomerName(targetSession.customerName || '');
    setCustomerPhone(targetSession.customerPhone || '');
    setDiscount(targetSession.discount || '');
    setDiscountType(targetSession.discountType || 'percentage');
    setAdditionalCharge(targetSession.additionalCharge || '');
    setApplyGst(targetSession.applyGst !== undefined ? targetSession.applyGst : true);
    setPaymentMethod(targetSession.paymentMethod || 'Cash');
    setSplitCash(targetSession.splitCash || 0);
    setSplitOnline(targetSession.splitOnline || 0);
    setOrderType(targetSession.orderType || (targetTableId === 'quick' ? 'Takeaway' : 'DineIn'));
    setKotStatus(targetSession.kotStatus || 'None');
    setKotId(targetSession.kotId || '');
    
    setActiveTable(targetTableId);
    localStorage.setItem('pos_active_table', targetTableId);
    
    setTimeout(() => {
      isSwitchingTable.current = false;
    }, 100);
  };

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setUserRole(userData.role);
      if (userData.paymentQrCode) setUserQrCode(userData.paymentQrCode);
      if (userData.shopName) setUserShopName(userData.shopName);
      if (userData.gstPercentage !== undefined) setUserGstRate(userData.gstPercentage);
    }
  }, [userData]);

  useEffect(() => {
    if (dishesData) {
      setDishes(Array.isArray(dishesData) ? dishesData : []);
    }
  }, [dishesData]);

  const fetchInventoryForCosting = async () => {
    const token = localStorage.getItem('token');
    try {
      const [invRes, sopRes] = await Promise.all([
        fetch(`${API_URL}/api/inventory`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/sop-packets`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const data = await invRes.json();
      const sopData = await sopRes.json();
      
      const allIngredients = [
        ...(data.rawMaterials || []).map((i: any) => ({ ...i, model: 'RawMaterial' })),
        ...(data.semiFinishedGoods || []).map((i: any) => ({ ...i, model: 'SemiFinishedGood' })),
        ...(data.premixes || []).map((i: any) => ({ ...i, model: 'Premix' })),
        ...(data.packaging || []).map((i: any) => ({ ...i, model: 'Packaging' })),
        ...(Array.isArray(sopData) ? sopData : []).map((i: any) => ({ ...i, model: 'SopPacket', costPerUnit: i.price, consumptionUnit: 'Packet' }))
      ];
      
      setAvailableIngredients(allIngredients);
    } catch (err) {
      console.error('Failed to fetch inventory for costing', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      // Client-side image compression
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      const compressedFile: File = await new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 800; // compress to max 800px

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;

          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  });
                  resolve(newFile);
                } else {
                  resolve(file); // fallback
                }
              },
              'image/jpeg',
              0.65 // 65% quality for aggressive size reduction
            );
          } else {
            resolve(file); // fallback
          }
          URL.revokeObjectURL(objectUrl);
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(file); // fallback
        };
        img.src = objectUrl;
      });

      const formData = new FormData();
      formData.append('image', compressedFile);

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        if (editingDish) {
          setEditingDish({ ...editingDish, imageUrl: data.url });
        } else {
          setNewDish({ ...newDish, imageUrl: data.url });
        }
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddDish = async () => {
    if (isSavingDish) return;
    setIsSavingDish(true);
    const token = localStorage.getItem('token');
    try {
      let currentImageUrl = newDish.imageUrl;
      if (fileInputRef.current?.files?.[0]) {
        const formData = new FormData();
        formData.append('image', fileInputRef.current.files[0]);
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          currentImageUrl = uploadData.imageUrl;
        }
      }

      const itemsToCreate = hasVariations && variations.length > 0
        ? variations.filter(v => v.name && v.price).map(v => ({
            name: `${newDish.name} - ${v.name}`,
            price: Number(v.price) || 0,
            templateDishId: (v as any).templateDishId
          }))
        : [{ name: newDish.name, price: Number(newDish.price) || 0, templateDishId: selectedTemplateDishId }];
        
      let successCount = 0;

      for (const item of itemsToCreate) {
        let currentRecipeIngredients = recipeIngredients; // Default from main select
        
        if (hasVariations && item.templateDishId) {
          try {
            const tRes = await fetch(`${API_URL}/api/costing/dish/${item.templateDishId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (tRes.ok) {
              const data = await tRes.json();
              currentRecipeIngredients = data.ingredientsCostDetails
                .filter((ing: any) => !ing.isSubIngredient)
                .map((ing: any) => ({
                  itemModel: ing.itemModel,
                  itemId: ing.itemId,
                  quantity: ing.quantity,
                  unit: ing.unit,
                  name: ing.name,
                }));
            }
          } catch(e) {}
        }

        const payload = {
          dishDetails: {
            name: item.name,
            price: item.price,
            ingredientPrice: Number(newDish.ingredientPrice) || 0,
            category: newDish.category || 'Main Course',
            imageUrl: currentImageUrl,
            allowedWastagePercentage: Number(advancedSetupData.allowedWastagePercentage) || 0
          },
          recipeDetails: { ingredients: currentRecipeIngredients },
          inventoryDetails: {
            platesPerPacket: Number(advancedSetupData.platesPerPacket) || 10,
            totalPlates: Number(advancedSetupData.totalPlates) || 0,
            lowStockThreshold: Number(advancedSetupData.lowStockThreshold) || 5,
            baseUnitName: advancedSetupData.baseUnitName || 'Packet',
            subUnitName: advancedSetupData.subUnitName || 'Plate'
          }
        };

        const res = await fetch(`${API_URL}/api/dishes/advanced-setup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        
        if (res.ok) successCount++;
      }

      if (successCount > 0) {
        setShowAddModal(false);
        setSetupStep(1);
        setNewDish({ name: '', price: '', ingredientPrice: '', category: 'Main Course', imageUrl: '' });
        setHasVariations(false);
        setVariations([{ name: 'Half', price: '' }, { name: 'Full', price: '' }]);
        setAdvancedSetupData({ allowedWastagePercentage: 0, platesPerPacket: 10, totalPlates: 0, lowStockThreshold: 5, baseUnitName: 'Packet', subUnitName: 'Plate' });
        setRecipeIngredients([]);
        mutateDishes();
        if (successCount < itemsToCreate.length) {
          alert('Some variations failed to save.');
        }
      } else {
        alert('Failed to save dish with advanced setup.');
      }
    } catch (err) {
      console.error('Failed to add dish', err);
    } finally {
      setIsSavingDish(false);
    }
  };

  const handleUpdateDish = async () => {
    if (!editingDish) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/dishes/${editingDish._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...editingDish,
          price: Number(editingDish.price) || 0,
          ingredientPrice: Number(editingDish.ingredientPrice) || 0
        })
      });
      if (res.ok) {
        setEditingDish(null);
        mutateDishes();
      }
    } catch (err) {
      console.error('Failed to update dish', err);
    }
  };

  const handleDeleteDish = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/dishes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) mutateDishes();
    } catch (err) {
      console.error('Failed to delete dish', err);
    }
  };

  const addToCart = (dish: Dish, addons: Dish[] = []) => {
    if (isManagementMode) return;
    setCart(prev => {
      const existing = prev.find(item => {
        if (item.dish._id !== dish._id) return false;
        const itemAddonIds = (item.addons || []).map(a => a._id).sort().join(',');
        const newAddonIds = addons.map(a => a._id).sort().join(',');
        return itemAddonIds === newAddonIds;
      });
      if (existing) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { dish, quantity: 1, sentQty: 0, addons }];
    });
    setCheckoutSuccess(false); // Reset success if new items added
  };

  const updateQuantity = (id: string, delta: number, index?: number) => {
    setCart(prev => prev.map((item, i) => {
      if ((index !== undefined && i === index) || (index === undefined && item.dish._id === id)) {
        const newQty = Math.max(0, item.quantity + delta);
        const newSentQty = Math.min(item.sentQty || 0, newQty);
        return { ...item, quantity: newQty, sentQty: newSentQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
    setCheckoutSuccess(false); // Reset success if quantity changed
  };

  const getItemQuantity = (id: string) => {
    const item = cart.find(i => i.dish._id === id);
    return item ? item.quantity : 0;
  };

  const total = cart.reduce((sum, item) => {
    const addonsTotal = item.addons ? item.addons.reduce((a, b) => a + b.price, 0) : 0;
    return sum + ((item.dish.price + addonsTotal) * item.quantity);
  }, 0);
  
  const parsedDiscount = parseFloat(discount) || 0;
  const discountAmount = discountType === 'flat' 
    ? parsedDiscount 
    : total * (parsedDiscount / 100);

  const afterDiscount = Math.max(0, total - discountAmount);
  const gstAmount = applyGst ? afterDiscount * (userGstRate / 100) : 0;
  const parsedAdditionalCharge = parseFloat(additionalCharge) || 0;
  const grandTotal = Math.round(afterDiscount + gstAmount + parsedAdditionalCharge);

  const availableCategories = useMemo(() => {
    const dynamicCats = dishes.map(d => d.category).filter(Boolean);
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...dynamicCats]));
  }, [dishes]);

  const categories = useMemo(() => {
    return ['All', ...availableCategories];
  }, [availableCategories]);

  const filteredDishes = useMemo(() => {
    return dishes.filter(d => 
      (activeCategory === 'All' || d.category === activeCategory) &&
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dishes, activeCategory, searchQuery]);

  const groupedDishes = useMemo(() => {
    if (isManagementMode) return filteredDishes;
    
    const groups = new Map();
    filteredDishes.forEach(dish => {
      const parts = dish.name.split(' - ');
      const baseName = parts[0].trim();
      const varName = parts.length > 1 ? parts.slice(1).join(' - ').trim() : 'Regular';

      if (!groups.has(baseName)) {
        groups.set(baseName, {
          isGroup: true,
          _id: `group_${baseName}`,
          name: baseName,
          category: dish.category,
          imageUrl: dish.imageUrl,
          variations: [],
          price: dish.price // Will hold minimum price
        });
      }
      
      const group = groups.get(baseName);
      if (!group.variations.find((v: any) => v.variationName.toLowerCase() === varName.toLowerCase())) {
        group.variations.push({ ...dish, variationName: varName });
      }
      if (dish.price < group.price) group.price = dish.price;
    });

    const result: any[] = [];
    groups.forEach(g => {
      if (g.variations.length === 1 && g.variations[0].variationName === 'Regular') {
        const originalDish = { ...g.variations[0] };
        delete originalDish.variationName;
        result.push(originalDish);
      } else {
        g.variations.sort((a: any, b: any) => a.price - b.price);
        result.push(g);
      }
    });

    return result;
  }, [filteredDishes, isManagementMode]);

  const isManager = ['admin', 'manager', 'user'].includes(userRole);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (paymentMethod === 'Online' && userQrCode && !showQrModal) {
      setShowQrModal(true);
      return;
    }

    // Zero Latency Checkout: Generate Bill sequence
    let currentBillSeq = generateBillSequence();

    setIsProcessingCheckout(true);
    const token = localStorage.getItem('token');
    
    const checkoutPayload = {
      items: cart.flatMap(item => [
        { dishId: item.dish._id, dishName: item.dish.name, quantity: item.quantity, note: item.note },
        ...(item.addons || []).map(addon => ({ dishId: addon._id, dishName: addon.name, quantity: item.quantity, note: 'Add-on' }))
      ]),
      customerName, customerPhone, discount: Number(discount) || 0, discountType, additionalCharge: Number(additionalCharge) || 0,
      applyGst, paymentMethod, orderType,
      splitPayments: paymentMethod === 'Split' ? { cash: splitCash, online: splitOnline } : undefined,
      kotId, 
      tempBillNo: currentBillSeq,
      offline_id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2)
    };

    setPrintedBillNo(currentBillSeq.toString());
    setPrintType('bill');
    
    setTimeout(async () => {
      const targetPrinter = localStorage.getItem('printerTarget_bill');
      let printSuccess = false;

      if (targetPrinter) {
        toast.loading(`Sending to ${targetPrinter}...`, { id: 'print_toast' });
        try {
          const res = await fetch(`${API_URL}/api/printers`, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              printerName: targetPrinter,
              jobType: 'bill',
              htmlContent: document.documentElement.outerHTML
            })
          });
          if (res.ok) {
            toast.success('Print sent successfully!', { id: 'print_toast' });
            printSuccess = true;
          } else {
            toast.error('Silent print failed, using dialog', { id: 'print_toast' });
            window.print();
            printSuccess = true;
          }
        } catch (e) {
          toast.error('Print error, using dialog', { id: 'print_toast' });
          window.print();
          printSuccess = true;
        }
      } else {
        window.print();
        printSuccess = true;
      }
      
      setPrintType(null);
      setIsProcessingCheckout(false);

      // We use setTimeout to give the browser time to clear the print dialog before confirming
      setTimeout(() => {
        if (window.confirm("Did the bill print successfully? Click OK to complete the order, or Cancel to go back and edit the cart.")) {
          setLastCheckoutData({
            cart: [...cart],
            customerName,
            customerPhone,
            total,
            discountAmount,
            discountType,
            parsedDiscount,
            applyGst,
            userGstRate,
            gstAmount,
            parsedAdditionalCharge,
            grandTotal,
            printedBillNo: currentBillSeq
          });
          setCheckoutSuccess(true);
          
          setCart([]);
          setCustomerName('');
          setCustomerPhone('');
          setDiscount('');
          setDiscountType('percentage');
          setAdditionalCharge('');
          setApplyGst(true);
          setPaymentMethod('Cash');
          setSplitCash(0);
          setSplitOnline(0);
          setOrderType(activeTable === 'quick' ? 'Takeaway' : 'DineIn');
          setKotStatus('None');
          setKotId('');
          
          // Background sync
          dataService.post(`${API_URL}/api/orders/checkout`, checkoutPayload, { 'Authorization': `Bearer ${token}` })
            .catch((err: any) => console.error('Background checkout error', err));
        } else {
          setPrintedBillNo('');
          setShowQrModal(false);
        }
      }, 500);
    }, 100);
  };

  // WebSocket for active KOT status
  useEffect(() => {
    if (!kotId || kotId === '') return;
    
    let active = true;
    const pollKotStatus = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await dataService.get(`${API_URL}/api/kots`, {
          'Authorization': `Bearer ${token}`
        });
        const activeKots = res;
        if (Array.isArray(activeKots)) {
          const currentKot = activeKots.find((k: any) => k._id === kotId);
          if (currentKot && active) {
            setKotStatus(currentKot.status);
          } else if (!currentKot && active) {
            // If not active, check history to see if it became Served/Cancelled
            const historyKots = await dataService.get(`${API_URL}/api/kots/history`, {
              'Authorization': `Bearer ${token}`
            });
            const matched = Array.isArray(historyKots) ? historyKots.find((k: any) => k._id === kotId) : null;
            if (matched && active) {
              setKotStatus(matched.status);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching KOT status:', err);
      }
    };
    
    pollKotStatus();

    // Setup WebSocket listener
    const socket = require('socket.io-client')(API_URL);
    if (userData) {
      const restaurantId = userData._id || userData.id || userData.userId;
      if (restaurantId) {
        socket.emit('joinRestaurant', restaurantId);
      }
    }
    
    socket.on('KOT_UPDATED', (updatedKot: any) => {
      if (String(updatedKot._id) === String(kotId) && active) {
        setKotStatus(updatedKot.status);
      }
    });

    return () => {
      active = false;
      socket.disconnect();
    };
  }, [kotId, userData]);

  const getRequiredPackaging = () => {
    const packagingMap: { [name: string]: number } = {};
    cart.forEach(item => {
      const logic = (item.dish as any).packagingLogic;
      if (logic) {
        let pkgs = [];
        if (orderType === 'Takeaway') pkgs = logic.takeaway || [];
        else if (orderType === 'Delivery') pkgs = logic.delivery || [];
        else if (orderType === 'DineIn') pkgs = logic.dineIn || [];
        
        pkgs.forEach((pkg: any) => {
          if (pkg && pkg.name) {
            packagingMap[pkg.name] = (packagingMap[pkg.name] || 0) + item.quantity;
          }
        });
      }
    });
    return Object.keys(packagingMap).map(name => ({ name, quantity: packagingMap[name] }));
  };

  const handleSendKot = () => {
    // Filter out items that have unsent quantities
    const unsentItems = cart.map(item => {
      const unsentQty = item.quantity - (item.sentQty || 0);
      return {
        dish: item.dish,
        quantity: unsentQty,
        note: item.note || '',
        addons: item.addons
      };
    }).filter(item => item.quantity > 0);

    if (unsentItems.length === 0) {
      alert("No new items to send to kitchen.");
      return;
    }
    
    // Zero Latency KOT: Generate or get shared sequence
    let currentSeq = tableSessions[activeTable]?.sequenceNo;
    if (!currentSeq) {
      currentSeq = generateKotSequence();
      setTableSessions(prev => ({
        ...prev,
        [activeTable]: { ...prev[activeTable], sequenceNo: currentSeq }
      }));
    }

    setIsSendingKot(true);
    const token = localStorage.getItem('token');
    
    const payload = {
      items: unsentItems.flatMap((item: any) => [
        {
          dishId: item.dish._id,
          dishName: item.dish.name,
          quantity: item.quantity,
          note: item.note
        },
        ...(item.addons || []).map((addon: any) => ({
          dishId: addon._id,
          dishName: addon.name,
          quantity: item.quantity,
          note: 'Add-on'
        }))
      ]),
      tableNumber: activeTable === 'quick' ? 'Quick Bill' : tables.find(t => t.id === activeTable)?.name || activeTable,
      orderType: orderType,
      customerName: customerName,
      customerPhone: customerPhone,
      tempKotNo: currentSeq,
      offline_id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2)
    };

    setKotStatus('Pending');
    setPrintingKot({ 
      ...payload, 
      kotNumber: currentSeq, 
      items: unsentItems,
      packaging: getRequiredPackaging(),
      createdAt: new Date().toISOString() 
    });
    setPrintType('kot');
    
    // Mark all items as sent in state immediately
    setCart(prev => prev.map(item => ({
      ...item,
      sentQty: item.quantity
    })));
    
    // Print instantly
    setTimeout(async () => {
      const targetPrinter = localStorage.getItem('printerTarget_kot');
      const token = localStorage.getItem('token');
      if (targetPrinter) {
        toast.loading(`Sending KOT to ${targetPrinter}...`, { id: 'kot_print_toast' });
        try {
          const res = await fetch(`${API_URL}/api/printers`, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              printerName: targetPrinter,
              jobType: 'kot',
              htmlContent: document.documentElement.outerHTML
            })
          });
          if (res.ok) {
            toast.success('KOT sent successfully!', { id: 'kot_print_toast' });
          } else {
            toast.error('Silent print failed, using dialog', { id: 'kot_print_toast' });
            window.print();
          }
        } catch (e) {
          toast.error('Print error, using dialog', { id: 'kot_print_toast' });
          window.print();
        }
      } else {
        window.print();
      }
      
      setPrintType(null);
      setIsSendingKot(false);
      
      // Send to backend in background
      dataService.post(`${API_URL}/api/kots`, payload, {
        'Authorization': `Bearer ${token}`
      }).then((data: any) => {
        if (data && !data.error) {
          setKotId(data.kot?._id || data.operation_id || '');
        }
      }).catch((err: any) => console.error('Background KOT error', err));
    }, 100);
  };

  const shareOrderOnWhatsApp = (billNumberToUse?: string) => {
    const activeData = lastCheckoutData || {
      cart, customerName, customerPhone, total, discountAmount, discountType, parsedDiscount, applyGst, userGstRate, gstAmount, parsedAdditionalCharge, grandTotal, printedBillNo
    };

    if (activeData.cart.length === 0) return;
    
    if (!activeData.customerPhone) {
      alert("Please enter customer phone number in the checkout panel to send WhatsApp bill.");
      return;
    }

    const itemsList = activeData.cart.map((item: any) => {
      const addonsTotal = item.addons ? item.addons.reduce((a: any, b: any) => a + b.price, 0) : 0;
      const addonText = item.addons && item.addons.length > 0 ? ` (+ ${item.addons.map((a: any) => a.name).join(', ')})` : '';
      return `- ${item.dish.name}${addonText} (x${item.quantity}) - Rs.${(item.dish.price + addonsTotal) * item.quantity}`;
    }).join('\n');
    
  
    const activeBillNo = (typeof billNumberToUse === 'string' && billNumberToUse) ? billNumberToUse : activeData.printedBillNo;
    
    const message = `Thank you ${activeData.customerName || 'Customer'},\n\nHere are your bill details:\n\n*Bill No:* #${activeBillNo || 'N/A'}\n\n*ORDER DETAILS:*\n${itemsList}\n\n*Subtotal: Rs.${activeData.total}*\n${activeData.discountAmount > 0 ? `*Discount: ${activeData.discountType === 'flat' ? `Rs.${activeData.parsedDiscount}` : `${activeData.parsedDiscount}%`} (Rs.${Math.round(activeData.discountAmount)})*\n` : ''}${activeData.applyGst ? `*GST (${activeData.userGstRate}%): Rs.${activeData.gstAmount.toFixed(2)}*\n` : ''}${activeData.parsedAdditionalCharge > 0 ? `*Additional Charge: Rs.${activeData.parsedAdditionalCharge}*\n` : ''}*Grand Total: Rs.${activeData.grandTotal}*\n\nThank you for visiting!\n\n_Sent via KYROZ+_`;
    
    const encodedMessage = encodeURIComponent(message);
    const formattedPhone = activeData.customerPhone.startsWith('+') ? activeData.customerPhone.substring(1) : (activeData.customerPhone.length === 10 ? `91${activeData.customerPhone}` : activeData.customerPhone);
    window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`, '_blank');
  };

  const renderCartContent = (isDrawer = false) => {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b border-foreground/5 shrink-0 flex items-center justify-between">
          <h2 className="text-sm font-black flex items-center gap-2 text-foreground">
            <ShoppingCart className="text-gold" size={16} /> ORDER SUMMARY
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setCart([]);
                setCustomerName('');
                setCustomerPhone('');
                setDiscount('');
                setDiscountType('percentage');
                setAdditionalCharge('');
                setApplyGst(true);
                setPaymentMethod('Cash');
                setOrderType(activeTable === 'quick' ? 'Takeaway' : 'DineIn');
                setCheckoutSuccess(false);
                setKotStatus('None');
                setKotId('');
              }}
              className="text-[10px] font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-1 rounded hover:bg-red-500/20 transition-all"
            >
              Clear
            </button>
            {isDrawer && (
              <button onClick={() => setIsCartOpen(false)} className="p-1 text-foreground/70 hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0 custom-scrollbar">
          <AnimatePresence>
            {cart.map((item, index) => (
              <motion.div
                key={`${item.dish._id}-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center justify-between bg-foreground/5 p-2.5 rounded-xl border border-foreground/5"
              >
                <div className="flex-1 pr-2">
                  <div className="flex items-start gap-1">
                    <div className={`mt-0.5 min-w-[10px] w-[10px] h-[10px] border flex items-center justify-center rounded-sm ${/(chicken|mutton|meat|gosht|egg|fish|murg|keema|anda)/i.test(item.dish.name) ? 'border-red-600' : 'border-green-600'}`}>
                      <div className={`w-[4px] h-[4px] rounded-full ${/(chicken|mutton|meat|gosht|egg|fish|murg|keema|anda)/i.test(item.dish.name) ? 'bg-red-600' : 'bg-green-600'}`}></div>
                    </div>
                    <h4 className="font-bold text-xs">{item.dish.name}</h4>
                  </div>
                  <p className="text-xs text-foreground/70">₹{item.dish.price} x {item.quantity}</p>
                  
                  {item.addons && item.addons.length > 0 && (
                    <div className="pl-4 mt-1 space-y-0.5">
                      {item.addons.map((addon, idx) => (
                        <div key={idx} className="flex justify-between text-[10px] text-foreground/60">
                          <span>+ {addon.name}</span>
                          <span>₹{addon.price} x {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.note && (
                    <p className="text-[10px] text-gold mt-1 italic leading-tight line-clamp-2">Note: {item.note}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const note = prompt(`Add Note for ${item.dish.name} (e.g. less spicy):`, item.note || '');
                      if (note !== null) {
                        setCart(prev => prev.map(i => i.dish._id === item.dish._id ? { ...i, note } : i));
                      }
                    }}
                    className={`p-1.5 rounded-lg transition-colors border ${item.note ? 'bg-gold/10 text-gold border-gold/30' : 'bg-foreground/5 text-foreground/70 border-foreground/10 hover:text-foreground hover:bg-foreground/10'}`}
                    title="Add Note"
                  >
                    <FileText size={12} />
                  </button>
                  <div className="flex items-center gap-2 bg-background rounded-xl p-1 border border-foreground/5 shrink-0">
                    <button onClick={() => updateQuantity(item.dish._id, -1, index)} className="text-foreground/70 hover:text-foreground"><Minus size={12} /></button>
                    <span className="text-xs font-bold min-w-[16px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.dish._id, 1, index)} className="text-gold hover:text-gold/80"><Plus size={12} /></button>
                  </div>
                </div>
                <div className="ml-3 font-black text-xs w-14 text-right shrink-0">₹{(item.dish.price + (item.addons ? item.addons.reduce((a, b) => a + b.price, 0) : 0)) * item.quantity}</div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-foreground/5 space-y-3 py-10">
              <Utensils size={32} />
              <p className="font-black uppercase tracking-widest text-[10px]">Select items to begin bill</p>
            </div>
          )}
        </div>

        {/* Checkout Form */}
        <div className="p-2 sm:p-3 bg-background border-t border-foreground/5 space-y-1.5 shrink-0">
          
          {/* Customer Details & Discount/Charge Toggles */}
          <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
            <input 
              type="text" 
              value={customerName}
              list="customer-names"
              onChange={(e) => {
                const val = e.target.value;
                setCustomerName(val);
                if (val && customersData) {
                  const match = customersData.find((c: any) => c.name === val);
                  if (match && !customerPhone) {
                    setCustomerPhone(match.phone);
                  }
                }
              }}
              placeholder="Customer Name"
              className="w-full bg-transparent border border-border rounded-lg px-2 py-1.5 text-[10px] text-foreground focus:outline-none focus:border-gold/50 placeholder:text-foreground/60"
            />
            {customersData && (
              <datalist id="customer-names">
                {customersData.map((c: any) => (
                  <option key={`name-${c._id || c.phone}`} value={c.name}>{c.phone}</option>
                ))}
              </datalist>
            )}
            <input 
              type="tel" 
              value={customerPhone}
              list="customer-phones"
              onChange={(e) => {
                const val = e.target.value;
                setCustomerPhone(val);
                if (val.length >= 10 && customersData) {
                  const match = customersData.find((c: any) => c.phone === val);
                  if (match && !customerName) {
                    setCustomerName(match.name);
                  }
                }
              }}
              placeholder="Phone No."
              className="w-full bg-transparent border border-border rounded-lg px-2 py-1.5 text-[10px] text-foreground focus:outline-none focus:border-gold/50 placeholder:text-foreground/60"
            />
            {customersData && (
              <datalist id="customer-phones">
                {customersData.map((c: any) => (
                  <option key={c._id || c.phone} value={c.phone}>{c.name}</option>
                ))}
              </datalist>
            )}
            
            <button 
              onClick={() => setModifierModalType('discount')}
              className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-all ${
                discount ? 'bg-gold/20 border-gold/50 text-gold' : 'bg-foreground/5 border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/30'
              }`}
              title="Apply Discount"
            >
              <Percent size={12} />
            </button>

            <button 
              onClick={() => setModifierModalType('charge')}
              className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-all ${
                additionalCharge ? 'bg-gold/20 border-gold/50 text-gold' : 'bg-foreground/5 border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/30'
              }`}
              title="Add Charge"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="flex justify-between items-center gap-2">
            <div className="flex flex-1 items-center gap-1">
              <button 
                onClick={() => setOrderType('Takeaway')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                  orderType === 'Takeaway' ? 'bg-gold text-black border-gold' : 'bg-foreground/5 text-foreground/70 border-foreground/10'
                }`}
              >
                Quick Bill
              </button>
              <button 
                onClick={() => setOrderType('DineIn')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                  orderType === 'DineIn' ? 'bg-gold text-black border-gold' : 'bg-foreground/5 text-foreground/70 border-foreground/10'
                }`}
              >
                Dine In
              </button>
              <button 
                onClick={() => setOrderType('Delivery')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                  orderType === 'Delivery' ? 'bg-gold text-black border-gold' : 'bg-foreground/5 text-foreground/70 border-foreground/10'
                }`}
              >
                Delivery
              </button>
            </div>

            <div className="w-px h-6 bg-foreground/10 shrink-0 mx-1 rounded-full" />

            <div className="flex w-36 items-center gap-1 shrink-0">
              <button 
                onClick={() => setPaymentMethod('Cash')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                  paymentMethod === 'Cash' ? 'bg-gold text-black border-gold' : 'bg-foreground/5 text-foreground/70 border-foreground/10'
                }`}
              >
                Cash
              </button>
              <button 
                onClick={() => setPaymentMethod('Online')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                  paymentMethod === 'Online' ? 'bg-gold text-black border-gold' : 'bg-foreground/5 text-foreground/70 border-foreground/10'
                }`}
              >
                Online
              </button>
              <button 
                onClick={() => setPaymentMethod('Split')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                  paymentMethod === 'Split' ? 'bg-gold text-black border-gold' : 'bg-foreground/5 text-foreground/70 border-foreground/10'
                }`}
              >
                Split
              </button>
            </div>
          </div>

          {paymentMethod === 'Split' && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Cash Amount</label>
                <input 
                  type="number" 
                  value={splitCash || ''}
                  onChange={(e) => setSplitCash(Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Online Amount</label>
                <input 
                  type="number" 
                  value={splitOnline || ''}
                  onChange={(e) => setSplitOnline(Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-end pt-1 border-t border-foreground/5">
            <span className="text-xs font-black uppercase tracking-widest">Total</span>
            <div className="text-right">
              {discountAmount > 0 && (
                <p className="text-[10px] text-red-500 font-bold line-through leading-none mb-0.5">₹{Math.round(total * (applyGst ? (1 + userGstRate / 100) : 1))}</p>
              )}
              <span className="text-2xl font-black text-gold leading-none">
                ₹{grandTotal}
              </span>
            </div>
          </div>

          {/* Packaging Preview Section Hidden (still works in background) */}

          {/* KOT Status Badge */}
          {kotStatus !== 'None' && (
            <div className="bg-gold/5 border border-gold/25 p-2 rounded-xl flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  kotStatus === 'Ready' 
                    ? 'bg-green-500' 
                    : kotStatus === 'Preparing' 
                      ? 'bg-orange-500' 
                      : 'bg-blue-500 animate-pulse'
                }`} />
                <div className="text-left">
                  <p className="text-[10px] font-black text-foreground/70 uppercase tracking-widest">KOT Pipeline</p>
                  <p className="text-xs font-black text-gold uppercase mt-0.5">{kotStatus}</p>
                </div>
              </div>
              {kotStatus === 'Ready' && (
                <span className="text-[10px] bg-green-500 text-black px-2.5 py-1 rounded-full font-black animate-bounce tracking-wider">
                  READY TO SERVE
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-2">
            {/* Checkout & KOT Actions */}
            {!checkoutSuccess ? (
              <div className="flex gap-2 items-center w-full">
                {(() => {
                  const hasUnsentItems = cart.some(item => item.quantity - (item.sentQty || 0) > 0);
                  return (
                    <button 
                      onClick={handleSendKot}
                      disabled={cart.length === 0 || isSendingKot || !hasUnsentItems}
                      className={`flex-1 py-2.5 rounded-lg font-black text-[11px] uppercase tracking-widest transition-all border flex items-center justify-center gap-1.5 ${
                        !hasUnsentItems && cart.length > 0
                          ? 'bg-green-500/10 border-green-500/20 text-green-500 cursor-not-allowed'
                          : 'bg-foreground/5 border-gold/30 text-gold hover:bg-gold hover:text-black hover:border-gold hover:scale-[1.01]'
                      }`}
                    >
                      {isSendingKot ? 'Sending...' : !hasUnsentItems && cart.length > 0 ? '✔ Sent' : <><ChefHat size={14} /> Send KOT</>}
                    </button>
                  );
                })()}

                {paymentMethod === 'Split' && Math.abs((splitCash || 0) + (splitOnline || 0) - grandTotal) > 1 && (
                  <div className="w-full text-center text-red-500 text-[10px] font-bold mt-2">
                    Split amounts must equal Grand Total (₹{grandTotal})
                  </div>
                )}
                <button 
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || (paymentMethod === 'Split' && Math.abs((splitCash || 0) + (splitOnline || 0) - grandTotal) > 1)}
                  className="flex-1 py-2.5 rounded-lg font-black text-[11px] uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 dark:bg-gold dark:text-black bg-foreground text-background hover:scale-[1.02] active:scale-95"
                >
                  Checkout
                </button>
              </div>
            ) : (
              <>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500/30 p-4 rounded-2xl flex items-center gap-3 mb-4"
                >
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-foreground shrink-0">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-green-500 uppercase tracking-widest">Order Processed Successfully</p>
                    <p className="text-[10px] text-green-500/60 font-bold">Receipt printed & data saved.</p>
                  </div>
                </motion.div>

                {lastCheckoutData?.customerPhone && lastCheckoutData.customerPhone.length >= 10 && (
                  <button 
                    onClick={() => shareOrderOnWhatsApp()}
                    className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl bg-green-500 text-foreground hover:scale-[1.02] active:scale-95 mb-3 flex items-center justify-center gap-2"
                  >
                    Send WhatsApp Bill
                  </button>
                )}

                <button 
                  onClick={() => {
                    setCheckoutSuccess(false);
                    setLastCheckoutData(null);
                    setPrintedBillNo('');
                    if (isDrawer) setIsCartOpen(false);
                  }}
                  className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl bg-foreground/10 text-foreground border border-foreground/10 hover:bg-foreground/20 mb-3"
                >
                  Start New Order
                </button>
              </>
            )}

            {userQrCode && (
              <div className="flex flex-col items-center p-4 bg-foreground/5 rounded-2xl border border-foreground/10 mt-4 mb-4">
                <p className="text-[10px] font-black text-foreground/70 uppercase tracking-widest mb-3">Shop Payment QR</p>
                <img src={userQrCode} alt="Payment QR" className="w-24 h-24 object-contain rounded-lg" />
              </div>
            )}


          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full relative bg-background text-foreground" data-theme={resolvedPosTheme}>
      <style jsx global>{`
        @media print {
          @page { 
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Hide EVERYTHING in the body using visibility */
          html, body, main {
            visibility: hidden !important;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            position: static !important;
          }
          /* Ensure wrapper divs don't trap the absolute positioning with padding or relative positioning */
          main > div, div[class*="relative"] {
            position: static !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Show ONLY the receipt container and its children */
          .receipt-container {
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            display: block !important;
            background: white !important;
            color: black !important;
          }
          
          .receipt-container * {
            visibility: visible !important;
            color: black !important;
            background: transparent !important;
          }
          
          /* Force hide specific heavy UI elements that might cause spacing issues */
          .no-print, header, footer, nav, aside, button, .glass-card {
            display: none !important;
          }

          /* Table fixes for thermal printers */
          .receipt-container table {
            display: table !important;
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .receipt-container tr { display: table-row !important; }
          .receipt-container td, .receipt-container th { 
            display: table-cell !important;
            padding: 4px !important;
          }
        }
      `}</style>
      
      {/* PRINT RECEIPT - MOVED TO TOP FOR BETTER SELECTIVITY */}
      <div className="receipt-container hidden print:block">
        {printType === 'kot' && printingKot ? (
          <div className="max-w-[80mm] mx-auto font-mono text-black px-1 pb-1 bg-white leading-tight">
            <div className="text-center border-b border-black pb-1 mb-1">
              <h1 className="text-sm font-black uppercase tracking-tighter text-center whitespace-nowrap m-0 p-0 leading-none">KITCHEN ORDER TICKET</h1>
              <p className="text-xs font-bold uppercase tracking-widest text-black m-0 p-0 leading-tight">KOT #{printingKot.kotNumber || 'OFFLINE'}</p>
              <p className="text-[10px] whitespace-nowrap">{new Date(printingKot.createdAt).toLocaleString()}</p>
            </div>

            <div className="border-b border-black pb-1 mb-1.5 space-y-0.5">
              <div className="flex justify-between text-[11px] font-black">
                <span>SOURCE:</span>
                <span>{printingKot.tableNumber}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>ORDER TYPE:</span>
                <span className="font-bold uppercase">{printingKot.orderType}</span>
              </div>
              {(printingKot.customerName || printingKot.customerPhone) && (
                <div className="pt-0.5 border-t border-black/10 mt-0.5">
                  {printingKot.customerName && <div className="flex justify-between text-[11px]"><span>CUSTOMER:</span><span className="font-bold uppercase">{printingKot.customerName}</span></div>}
                  {printingKot.customerPhone && <div className="flex justify-between text-[11px]"><span>PHONE:</span><span className="font-bold uppercase">{printingKot.customerPhone}</span></div>}
                </div>
              )}
            </div>

            <table className="w-full text-[11px] mb-1">
              <thead>
                <tr className="border-b border-black text-left font-black leading-none">
                  <th className="py-0.5">Item Name</th>
                  <th className="py-0.5 text-right">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {printingKot.items.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-0.5 pr-1 leading-tight">
                      <span className="font-bold">{item.dishId?.name || item.dish?.name || item.name || 'Unknown Dish'}</span>
                      {item.addons && item.addons.length > 0 && (
                        <div className="text-[10px] font-normal leading-tight text-black/80 pl-2">
                          {item.addons.map((a: any) => `+ ${a.name}`).join(', ')}
                        </div>
                      )}
                      {item.note && (
                        <div className="text-[10px] italic mt-0 font-bold leading-none">
                          * Note: {item.note}
                        </div>
                      )}
                    </td>
                    <td className="py-0.5 text-right font-black text-sm align-top">x{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>


            <div className="border-t border-dashed border-black pt-1.5 mt-2 text-center text-[9px]">
              <p className="uppercase tracking-[0.2em]">SOP & Prep Checklist Printed</p>
              <p className="uppercase tracking-[0.3em] font-black mt-0.5 text-[7px]">Powered by KYROZPLUS</p>
            </div>
          </div>
        ) : (
          <div className="max-w-[80mm] mx-auto font-mono text-black px-1 pb-1 bg-white leading-tight">
            {/* Header section - All Centered like screenshot */}
            <div className="text-center mb-1">
              <h1 className="text-xl font-black uppercase tracking-tight m-0 leading-none pb-1">{userShopName}</h1>
              {user?.shopAddress && <p className="text-[10px] uppercase font-bold m-0 leading-tight">{user.shopAddress}</p>}
              <p className="text-[10px] font-bold whitespace-nowrap m-0 leading-tight">Receipt / Bill {printedBillNo ? `#${printedBillNo}` : ''}</p>
              <p className="text-[10px] whitespace-nowrap m-0 leading-tight pb-1">{new Date().toLocaleString()}</p>
              
              {/* Customer Details - Centered as well for clean look */}
              {(customerName || customerPhone) && (
                <div className="border-t border-black/20">
                  <p className="font-black uppercase tracking-tighter text-[10px] whitespace-nowrap m-0 leading-tight pt-0.5">
                    {customerName} {customerName && customerPhone && '-'} {customerPhone}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t-2 border-b-2 border-black py-0.5 mb-1">
              <table className="w-full text-[10px] leading-tight">
                <thead>
                  <tr className="text-left border-b border-black">
                    <th className="py-0.5 font-black">Item</th>
                    <th className="py-0.5 text-center font-black">Qty</th>
                    <th className="py-0.5 text-right font-black">Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => {
                    const addonsTotal = item.addons ? item.addons.reduce((a, b) => a + b.price, 0) : 0;
                    return (
                      <tr key={idx} className="border-b border-black/5 last:border-0">
                        <td className="py-0.5 pr-1 leading-tight text-[12px] font-bold">
                          {item.dish.name}
                          {item.addons && item.addons.length > 0 && (
                            <div className="text-[10px] font-normal leading-tight text-black/60 pl-2">
                              {item.addons.map(a => `+ ${a.name}`).join(', ')}
                            </div>
                          )}
                        </td>
                        <td className="py-0.5 px-1 text-center font-bold text-[12px] whitespace-nowrap align-top">x {item.quantity}</td>
                        <td className="py-0.5 pl-1 text-right font-black text-[12px] whitespace-nowrap align-top">₹{(item.dish.price + addonsTotal) * item.quantity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-0 mb-1">
              {activeTable !== 'quick' && (
                <div className="flex justify-between items-center text-[10px] font-black border-b border-black/10 pb-0.5 mb-0.5">
                  <span className="uppercase tracking-widest">TABLE:</span>
                  <span>{tables.find(t => t.id === activeTable)?.name}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-[10px] leading-tight">
                <span className="font-bold uppercase tracking-widest">Subtotal:</span>
                <span className="font-bold">₹{total}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-[10px] text-black leading-tight">
                  <span className="font-bold uppercase tracking-widest">Discount ({discountType === 'flat' ? '₹' : ''}{discount}{discountType === 'percentage' ? '%' : ''}):</span>
                  <span className="font-bold">-₹{Math.round(discountAmount)}</span>
                </div>
              )}
              {applyGst && (
                <div className="flex justify-between items-center text-[10px] leading-tight">
                  <span className="font-bold uppercase tracking-widest">Taxes ({userGstRate}%):</span>
                  <span className="font-bold">₹{Math.round(gstAmount)}</span>
                </div>
              )}
              {parsedAdditionalCharge > 0 && (
                <div className="flex justify-between items-center text-[10px] leading-tight">
                  <span className="font-bold uppercase tracking-widest">Charges:</span>
                  <span className="font-bold">₹{Math.round(parsedAdditionalCharge)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-sm font-black border-t border-black pt-0.5 pb-0.5 leading-tight">
              <span>TOTAL:</span>
              <span>₹{grandTotal}</span>
            </div>

            {paymentMethod === 'Split' && (
              <div className="border-t border-black pt-1 pb-1 text-left text-[11px]">
                <div className="font-bold">Split Payment Info :</div>
                <div className="pl-2 mt-0.5 space-y-0.5">
                  <div>Cash - Rs {Number(splitCash).toFixed(2)}</div>
                  <div>Online - Rs {Number(splitOnline).toFixed(2)}</div>
                </div>
              </div>
            )}

            <div className="border-t border-dashed border-black pt-1 text-center">
              <div className="text-[9px] font-black tracking-widest uppercase flex flex-col items-center leading-tight">
                <span>Order Type: {orderType === 'Takeaway' ? 'Quick Bill' : orderType === 'DineIn' ? 'Dine In' : orderType}</span>
                <span>Payment: {paymentMethod}</span>
              </div>
              <p className="mt-1 font-black text-[9px] uppercase tracking-widest leading-tight">Thank you for visiting!</p>
              <p className="uppercase tracking-[0.2em] font-bold mt-0.5 text-[6px] leading-none">Powered by KYROZPLUS</p>
            </div>

            {userQrCode && (
              <div className="flex flex-col items-center mb-4 mt-4">
                <p className="text-[8px] uppercase tracking-widest mb-1 font-bold opacity-60">Scan to Pay Online</p>
                <div className="border-4 border-black p-2 rounded-2xl">
                  <img src={userQrCode} alt="QR Code" className="w-32 h-32" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 no-print items-start w-full">
        {/* Floating Cart Button (Mobile only) */}
        <div className="fixed bottom-6 right-6 z-[60] lg:hidden">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-16 h-16 bg-gold rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)] text-black relative hover:scale-110 active:scale-95 transition-all group"
          >
            <ShoppingCart size={24} className="group-hover:rotate-12 transition-transform" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-foreground text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-background">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Desktop Vertical Categories Sidebar */}
        <div className="hidden lg:flex flex-col w-[160px] xl:w-[200px] shrink-0 gap-2 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
          <div className="bg-card glass-card rounded-2xl border border-foreground/5 p-3 flex flex-col gap-2">
            <h3 className="text-[10px] font-black text-foreground/70 uppercase tracking-widest px-2 mb-2">Categories</h3>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat ? 'bg-gold text-black shadow-md' : 'bg-card shadow-sm text-foreground/70 hover:bg-foreground/10'
                }`}
              >
                {cat}
              </button>
            ))}

          </div>
        </div>

        {/* Mobile Horizontal Categories (hidden on desktop) */}
        <div className="lg:hidden w-full flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeCategory === cat ? 'bg-gold text-black border-gold' : 'bg-foreground/10 text-foreground/70 border-foreground/10'
              }`}
            >
              {cat}
            </button>
          ))}

        </div>

        {/* Middle Column: Menu list */}
        <div className="flex-1 w-full min-w-0 flex flex-col">
          <div className="bg-card glass-card p-4 rounded-2xl border border-foreground/5 space-y-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg md:text-xl font-black flex items-center gap-3">
                <Utensils className="text-gold" /> {isManagementMode ? 'SHOP MANAGER' : 'DISH MENU'}
              </h2>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/70" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border border-foreground/10 rounded-xl py-2 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:border-gold/50"
                  />
                </div>
                {isManager && (
                  <>
                    <button 
                      onClick={() => setShowShareMenuModal(true)}
                      className="p-2 rounded-xl border border-foreground/10 bg-card shadow-sm text-foreground/70 hover:text-foreground transition-all flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest"
                    >
                      <Share2 size={16} /> Share
                    </button>
                    <button 
                      onClick={() => setIsManagementMode(!isManagementMode)}
                      className={`p-2 rounded-xl border transition-all flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest ${
                        isManagementMode ? 'bg-gold text-black border-gold' : 'bg-card shadow-sm text-foreground/70 border-foreground/10'
                      }`}
                    >
                      <Settings size={16} /> {isManagementMode ? 'Exit' : 'Manage'}
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Tables Bar */}
            {!isManagementMode && (
              <div className="border-t border-foreground/5 pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-foreground/70 uppercase tracking-widest pl-1">TABLE SELECTION</label>
                  {isManager && (
                    <div className="flex items-center gap-2">
                      <button onClick={handleAddTable} className="text-[10px] font-black text-gold uppercase tracking-widest hover:text-foreground transition-colors flex items-center gap-1">
                        <Plus size={10} /> Add
                      </button>
                      <button onClick={handleRemoveLastTable} disabled={tables.length <= 1} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors flex items-center gap-1 disabled:opacity-30">
                        <Minus size={10} /> Remove
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {tables.map(t => {
                    const session = tableSessions[t.id];
                    const hasItems = session && session.cart && session.cart.length > 0;
                    const isActive = activeTable === t.id;
                    const tableKotStatus = session && session.kotStatus;
                    
                    const tableSubtotal = hasItems ? session.cart.reduce((sum: number, item: any) => {
                      const addonsTotal = item.addons ? item.addons.reduce((a: any, b: any) => a + b.price, 0) : 0;
                      return sum + ((item.dish.price + addonsTotal) * item.quantity);
                    }, 0) : 0;

                    return (
                      <button
                        key={t.id}
                        onClick={() => switchTable(t.id)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border flex items-center gap-1.5 relative ${
                          isActive ? 'bg-gold text-black border-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]' : hasItems ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-card shadow-sm text-foreground/80 border-foreground/20'
                        }`}
                      >
                        <span>{t.name}</span>
                        {tableKotStatus && tableKotStatus !== 'None' && (
                          <span className={`w-2 h-2 rounded-full ${tableKotStatus === 'Ready' ? 'bg-green-500' : tableKotStatus === 'Preparing' ? 'bg-orange-500' : 'bg-blue-500 animate-pulse'}`} />
                        )}
                        {hasItems && (
                          <span className={`text-[8px] px-1 py-0.5 rounded-md font-bold ${isActive ? 'bg-black text-gold' : 'bg-red-500 text-foreground'}`}>
                            ₹{tableSubtotal}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {isManagementMode && (
              <div className="flex justify-end pt-2 border-t border-foreground/5">
                <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-green-500 text-foreground rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Plus size={14} /> Add Item
                </button>
              </div>
            )}
          </div>
          
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 pr-1 pb-24">
            {!dishesData ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-foreground/50 gap-4">
                <Loader2 className="animate-spin" size={48} />
                <p className="font-black uppercase tracking-widest text-sm">Loading Menu...</p>
              </div>
            ) : groupedDishes.map(dish => {
              const quantity = dish.isGroup 
                ? dish.variations.reduce((sum: number, v: any) => sum + getItemQuantity(v._id), 0) 
                : getItemQuantity(dish._id);
              
              return (
                <motion.div
                  key={dish._id}
                  onClick={() => dish.isGroup && setSelectedGroupedDish(dish)}
                  className={`bg-card glass-card rounded-2xl border transition-all flex flex-col overflow-hidden min-h-[100px] h-full ${
                    isManagementMode ? 'border-foreground/10' : 'border-foreground/5 hover:border-gold/30'
                  } ${dish.isGroup && !isManagementMode ? 'cursor-pointer hover:shadow-lg' : ''}`}
                >
                  <div className="h-16 hidden sm:block relative overflow-hidden bg-card shadow-sm shrink-0">
                    {dish.imageUrl ? (
                      <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-foreground/10">
                        <ImageIcon size={20} />
                      </div>
                    )}
                    {isManagementMode && (
                      <div className="absolute top-1 right-1 flex gap-1">
                        <button onClick={() => setEditingDish(dish)} className="p-1.5 bg-foreground/10 rounded-md text-foreground hover:text-gold"><Edit size={10}/></button>
                        <button onClick={() => handleDeleteDish(dish._id)} className="p-1.5 bg-foreground/10 rounded-md text-foreground hover:text-red-500"><Trash2 size={10}/></button>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 sm:p-3 flex flex-col justify-between flex-1 gap-2">
                    <div className="flex items-start gap-1">
                      <div className={`mt-0.5 min-w-[10px] w-[10px] h-[10px] border flex items-center justify-center rounded-sm ${/(chicken|mutton|meat|gosht|egg|fish|murg|keema|anda)/i.test(dish.name) ? 'border-red-600' : 'border-green-600'}`}>
                        <div className={`w-[4px] h-[4px] rounded-full ${/(chicken|mutton|meat|gosht|egg|fish|murg|keema|anda)/i.test(dish.name) ? 'bg-red-600' : 'bg-green-600'}`}></div>
                      </div>
                      <h3 className="font-bold text-[11px] sm:text-xs leading-tight line-clamp-2">{dish.name}</h3>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-sm font-black text-foreground flex items-baseline">
                        ₹{dish.price}
                        {dish.isGroup && <span className="text-[9px] font-normal text-foreground/50 ml-1">onwards</span>}
                      </span>
                      {!isManagementMode && (
                        <div className="flex items-center gap-1.5 bg-card shadow-sm p-1 rounded-lg border border-foreground/10">
                          {dish.isGroup ? (
                            <button onClick={(e) => { e.stopPropagation(); setSelectedGroupedDish(dish); }} className="px-2 py-1 bg-gold/10 text-gold rounded text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-black">
                              {quantity > 0 ? `${quantity} Added` : 'Options'}
                            </button>
                          ) : quantity > 0 ? (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); updateQuantity(dish._id, -1); }} className="w-5 h-5 bg-card shadow-sm rounded flex items-center justify-center text-foreground/60"><Minus size={10} /></button>
                              <span className="text-[10px] font-black min-w-[12px] text-center">{quantity}</span>
                              <button onClick={(e) => { e.stopPropagation(); addToCart(dish); }} className="w-5 h-5 bg-gold/10 rounded flex items-center justify-center text-gold"><Plus size={10} /></button>
                            </>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); addToCart(dish); }} className="px-2 py-1 bg-gold/10 text-gold rounded text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-black">Add</button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Permanent Sidebar Cart on Desktop/Tablet */}
        <div className="hidden lg:flex w-[320px] xl:w-[380px] 2xl:w-[450px] shrink-0 bg-card glass-card border border-foreground/10 rounded-[2rem] flex-col overflow-hidden h-[calc(100vh-8rem)] sticky top-24 shadow-xl">
          {renderCartContent(false)}
        </div>
      </div>

      {/* CART OVERLAY - Slide from Right for Mobile (below lg) */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-foreground/10 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-full max-w-md bg-card glass-card h-full border-l border-foreground/10 flex flex-col overflow-hidden shadow-2xl"
            >
              {renderCartContent(true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODALS (Simplified for clarity) */}
      <AnimatePresence>
        {(showAddModal || editingDish) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-foreground/10 rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto overflow-x-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black uppercase tracking-tighter">{editingDish ? 'Edit Item' : 'New Item'}</h3>
                <button onClick={() => { setShowAddModal(false); setEditingDish(null); }}><X /></button>
              </div>
              <div className="space-y-4">
                {editingDish ? (
                  <>
                    <input type="text" value={editingDish.name} onChange={(e) => setEditingDish({...editingDish, name: e.target.value})} placeholder="Item Name" className="w-full bg-card shadow-sm p-4 rounded-xl border border-foreground/10" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="number" value={editingDish.price} onChange={(e) => setEditingDish({...editingDish, price: Number(e.target.value)})} placeholder="Price" className="w-full bg-card shadow-sm p-4 rounded-xl border border-foreground/10" />
                      <input type="number" value={editingDish.ingredientPrice} onChange={(e) => setEditingDish({...editingDish, ingredientPrice: Number(e.target.value)})} placeholder="Cost" className="w-full bg-card shadow-sm p-4 rounded-xl border border-foreground/10" />
                    </div>
                    {editingDish.ingredientPrice > 0 && (
                      <p className="text-xs text-foreground/50 italic px-2">
                        💡 Suggested Selling Price: <span className="text-gold font-bold">₹{Math.round(editingDish.ingredientPrice * 2.5)}</span> - <span className="text-gold font-bold">₹{Math.round(editingDish.ingredientPrice * 5)}</span>
                      </p>
                    )}
                    <button onClick={handleUpdateDish} className="w-full py-4 bg-gold text-black font-black uppercase rounded-xl">Save Changes</button>
                  </>
                ) : (
                  <>
                    {/* Setup Header */}
                    <div className="flex items-center gap-2 mb-4">
                      {[1, 2, 3].map(step => (
                        <div key={step} className={`flex-1 h-1 rounded-full ${setupStep >= step ? 'bg-gold' : 'bg-foreground/10'}`} />
                      ))}
                    </div>
                    <p className="text-xs uppercase font-bold tracking-widest text-gold mb-4">
                      {setupStep === 1 && "Step 1: Basic Details"}
                      {setupStep === 2 && "Step 2: Costing & Wastage"}
                      {setupStep === 3 && "Step 3: Inventory Master"}
                    </p>

                    {setupStep === 1 && (
                      <div className="space-y-4">
                        <input type="text" value={newDish.name} onChange={(e) => setNewDish({...newDish, name: e.target.value})} placeholder="Item Name *" className="w-full bg-card shadow-sm p-4 rounded-xl border border-foreground/10" required />
                        
                        <div className="w-full">
                          {isAddingNewCategory ? (
                            <div className="relative">
                              <input 
                                type="text" 
                                value={newDish.category} 
                                onChange={(e) => setNewDish({...newDish, category: e.target.value})} 
                                placeholder="New Category Name" 
                                className="w-full bg-card shadow-sm p-4 rounded-xl border border-foreground/10 pr-10" 
                                autoFocus
                              />
                              <button 
                                onClick={() => { setIsAddingNewCategory(false); setNewDish({...newDish, category: ''}); }} 
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <select 
                              value={newDish.category}
                              onChange={(e) => {
                                if (e.target.value === 'ADD_NEW') {
                                  setIsAddingNewCategory(true);
                                  setNewDish({...newDish, category: ''});
                                } else {
                                  setNewDish({...newDish, category: e.target.value});
                                  setSelectedTemplateCategory(e.target.value);
                                }
                              }}
                              className="w-full bg-background p-4 rounded-xl border border-foreground/10 text-sm"
                            >
                              <option value="" disabled>Select Category</option>
                              {availableCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                              <option value="ADD_NEW" className="text-gold font-bold">+ Add New Category</option>
                            </select>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 mb-2">
                          <input type="checkbox" id="hasVariations" checked={hasVariations} onChange={(e) => setHasVariations(e.target.checked)} className="accent-gold w-4 h-4 cursor-pointer" />
                          <label htmlFor="hasVariations" className="text-sm font-bold text-foreground cursor-pointer">Dish has sizes/variations (e.g. Half/Full)</label>
                        </div>

                        {!hasVariations ? (
                          <input type="number" value={newDish.price} onChange={(e) => setNewDish({...newDish, price: e.target.value})} placeholder="Selling Price *" className="w-full bg-card shadow-sm p-4 rounded-xl border border-foreground/10 mb-4" required={!hasVariations} />
                        ) : (
                          <div className="bg-foreground/5 p-4 rounded-xl border border-foreground/10 space-y-3 mb-4">
                            <p className="text-xs font-bold text-foreground/60 uppercase">Variations</p>
                            {variations.map((v, i) => (
                              <div key={i} className="flex flex-col gap-2 bg-card shadow-sm p-3 rounded-lg border border-foreground/10">
                                <div className="flex gap-2">
                                  <input type="text" value={v.name} onChange={(e) => {
                                    const newV = [...variations];
                                    newV[i].name = e.target.value;
                                    setVariations(newV);
                                  }} placeholder="Size (e.g. Half)" className="flex-[2] min-w-0 bg-background p-3 rounded-lg border border-foreground/10 text-sm" />
                                  <input type="number" value={v.price} onChange={(e) => {
                                    const newV = [...variations];
                                    newV[i].price = e.target.value;
                                    setVariations(newV);
                                  }} placeholder="Price" className="flex-[1] min-w-0 bg-background p-3 rounded-lg border border-foreground/10 text-sm" />
                                  <button onClick={() => {
                                    const newV = variations.filter((_, idx) => idx !== i);
                                    setVariations(newV);
                                  }} className="p-3 shrink-0 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"><X size={16} /></button>
                                </div>
                                <select 
                                  value={(v as any).templateDishId || ''}
                                  onChange={(e) => {
                                    const newV = [...variations];
                                    (newV[i] as any).templateDishId = e.target.value;
                                    setVariations(newV);
                                  }}
                                  className="w-full bg-background p-3 rounded-lg border border-gold/30 text-sm outline-none focus:border-gold text-foreground"
                                >
                                  <option value="">No template (Setup manually)</option>
                                  {dishesData?.filter((d: any) => !newDish.category || d.category === newDish.category).map((dish: any) => (
                                    <option key={dish._id} value={dish._id}>{dish.name} (Cost: ₹{dish.ingredientPrice || 0})</option>
                                  ))}
                                </select>
                              </div>
                            ))}
                            <button onClick={() => setVariations([...variations, { name: '', price: '' }])} className="text-xs font-bold text-gold uppercase tracking-widest hover:underline">+ Add Another Size</button>
                          </div>
                        )}



                        {/* Auto Costing Template Linker */}
                        {!isAddingNewCategory && newDish.category && !hasVariations && (
                          <div className="space-y-2 bg-gold/10 p-4 rounded-xl border border-gold/20">
                            <label className="text-xs uppercase font-bold text-gold flex items-center justify-between">
                              <span>Copy Costing from Existing Dish (Optional)</span>
                              {importingTemplate && <Loader2 className="animate-spin" size={14} />}
                            </label>
                            <select
                              value={selectedTemplateDishId}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSelectedTemplateDishId(val);
                                if (val) {
                                  handleImportTemplate(val);
                                }
                              }}
                              className="w-full bg-background p-3 rounded-lg border border-gold/30 text-sm outline-none focus:border-gold text-foreground"
                            >
                              <option value="">No template (Setup manually)</option>
                              {dishesData?.filter((d: any) => !newDish.category || d.category === newDish.category).map((dish: any) => (
                                <option key={dish._id} value={dish._id}>{dish.name} (Cost: ₹{dish.ingredientPrice || 0})</option>
                              ))}
                            </select>
                            {recipeIngredients.length > 0 && selectedTemplateDishId && (
                              <p className="text-[10px] text-green-400 font-bold flex items-center gap-1">
                                <CheckCircle size={10} /> Costing logic linked successfully!
                              </p>
                            )}
                          </div>
                        )}

                        <button 
                          onClick={() => { 
                            if (!newDish.name) {
                              alert('Dish Name is mandatory');
                              return;
                            }
                            if (hasVariations) {
                              const validVariations = variations.filter(v => v.name && v.price);
                              if (validVariations.length === 0) {
                                alert('Please add at least one valid variation with a name and price.');
                                return;
                              }
                            } else if (!newDish.price) {
                              alert('Price is mandatory');
                              return;
                            }
                            handleAddDish();
                          }} 
                          disabled={isSavingDish || loadingDishes}
                          className="w-full py-4 bg-gold text-black font-black uppercase rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSavingDish ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />} 
                          {isSavingDish ? 'Adding...' : 'Add Dish'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VARIATIONS MODAL */}
      <AnimatePresence>
        {selectedGroupedDish && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full">
              <div className="p-6 border-b border-foreground/10 flex justify-between items-center sticky top-0 bg-card z-10">
                <h2 className="text-xl font-black uppercase tracking-tight">{selectedGroupedDish.name}</h2>
                <button onClick={() => { setSelectedGroupedDish(null); setSelectedVariation(null); setSelectedAddons([]); }} className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-8">
                {/* Sizes */}
                <div>
                  <h3 className="text-sm font-bold text-foreground/60 uppercase tracking-widest mb-4">Select Size <span className="text-red-500">*</span></h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedGroupedDish.variations
                      .filter((v: any) => {
                         const varName = v.variationName.toLowerCase();
                         return !varName.includes('extra') && !varName.includes('addon') && !varName.includes('add-on') && !varName.includes('add on');
                      })
                      .map((v: any) => (
                      <button
                        key={v._id}
                        onClick={() => setSelectedVariation(v)}
                        className={`p-4 rounded-2xl border-2 text-center transition-all ${selectedVariation?._id === v._id ? 'border-gold bg-gold/5 shadow-md scale-[1.02]' : 'border-foreground/10 hover:border-gold/30 hover:bg-foreground/5'}`}
                      >
                        <p className="font-bold text-sm mb-1">{v.variationName}</p>
                        <p className="text-xs font-black text-gold">₹{v.price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Addons */}
                {(() => {
                  const rawAddons = dishes.filter(d => {
                    const cat = (d.category || '').toLowerCase();
                    const name = (d.name || '').toLowerCase();
                    const isAddonCat = cat.includes('add-on') || cat.includes('addon');
                    const hasExtra = name.includes('extra') || name.includes('addon') || name.includes('add on');
                    
                    if (!isAddonCat && !hasExtra) return false;

                    if (d.name.includes(' - ')) {
                      const baseName = d.name.split(' - ')[0].trim().toLowerCase();
                      const baseHasExtra = baseName.includes('extra') || baseName.includes('addon') || baseName.includes('add on');
                      
                      // Allow if the base name itself indicates it's an addon group (e.g. "Extra Cheese - Large")
                      if (baseHasExtra) return true;
                      
                      // If it's a specific variation for the CURRENT dish, show it in Addons.
                      if (selectedGroupedDish && baseName === selectedGroupedDish.name.toLowerCase()) {
                        return true;
                      }

                      // Otherwise, this is a variation of a DIFFERENT main dish
                      // We should NOT show it as a generic addon.
                      return false;
                    }
                    
                    return true;
                  });
                  const uniqueAddons: any[] = [];
                  const seenNames = new Set();
                  rawAddons.forEach(addon => {
                    const normalized = addon.name.trim().toLowerCase();
                    if (!seenNames.has(normalized)) {
                      seenNames.add(normalized);
                      uniqueAddons.push(addon);
                    }
                  });
                  if (uniqueAddons.length === 0) return null;
                  return (
                    <div>
                      <h3 className="text-sm font-bold text-foreground/60 uppercase tracking-widest mb-4">Add-ons</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {uniqueAddons.map(addon => {
                          const isSelected = selectedAddons.some(a => a.name.trim().toLowerCase() === addon.name.trim().toLowerCase());
                          return (
                            <button
                              key={addon._id}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedAddons(selectedAddons.filter(a => a.name.trim().toLowerCase() !== addon.name.trim().toLowerCase()));
                                } else {
                                  setSelectedAddons([...selectedAddons, addon]);
                                }
                              }}
                              className={`p-4 rounded-2xl border-2 text-center transition-all ${isSelected ? 'border-gold bg-gold/5 shadow-md scale-[1.02]' : 'border-foreground/10 hover:border-gold/30 hover:bg-foreground/5'}`}
                            >
                              <p className="font-bold text-sm mb-1 line-clamp-2">{addon.name}</p>
                              <p className="text-xs font-black text-gold">+ ₹{addon.price}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="p-6 border-t border-foreground/10 bg-card sticky bottom-0 z-10 flex gap-4">
                <button 
                  onClick={() => {
                    if (!selectedVariation) return alert('Please select a size!');
                    addToCart(selectedVariation, selectedAddons);
                    setSelectedGroupedDish(null);
                    setSelectedVariation(null);
                    setSelectedAddons([]);
                  }}
                  className="flex-1 bg-gold text-black font-black uppercase py-4 rounded-xl flex justify-center items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-gold/20"
                >
                  <Plus size={18} /> Add to Cart (₹{(selectedVariation?.price || 0) + selectedAddons.reduce((sum, a) => sum + a.price, 0)})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR PAYMENT MODAL */}
      <AnimatePresence>
        {showQrModal && userQrCode && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-foreground/10 rounded-[2.5rem] p-8 w-full max-w-sm flex flex-col items-center">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Scan to Pay</h3>
              <p className="text-sm text-foreground/60 mb-6 text-center">Amount Due: <span className="text-gold font-black text-xl">₹{grandTotal}</span></p>
              
              <div className="bg-white p-4 rounded-3xl mb-8 w-64 h-64 flex items-center justify-center">
                <img src={userQrCode} alt="Payment QR" className="w-full h-full object-contain" />
              </div>

              <div className="flex w-full gap-4">
                <button 
                  onClick={() => setShowQrModal(false)}
                  className="flex-1 py-4 bg-card shadow-sm text-foreground font-black uppercase rounded-xl border border-foreground/10 hover:bg-foreground/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessingCheckout || (paymentMethod === 'Split' && Math.abs((splitCash || 0) + (splitOnline || 0) - grandTotal) > 1)}
                  className="flex-[2] py-4 bg-green-500 text-foreground font-black uppercase rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessingCheckout ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                  Payment Received
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Menu Modal */}
      <AnimatePresence>
        {showShareMenuModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background backdrop-blur-sm" onClick={() => setShowShareMenuModal(false)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-card glass-card border border-foreground/10 p-8 rounded-3xl w-full max-w-sm flex flex-col items-center text-center"
            >
              <button 
                onClick={() => setShowShareMenuModal(false)}
                className="absolute top-4 right-4 text-foreground/70 hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-16 h-16 bg-gold-gradient rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                <Utensils size={32} className="text-black" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight mb-2">Digital Menu</h2>
              <p className="text-xs text-foreground/60 mb-8 font-bold">Ask customers to scan this QR code to view your live digital menu.</p>
              
              <div className="bg-white p-4 rounded-3xl mb-6 shadow-xl">
                {user ? (
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.origin + '/menu/' + user._id)}`} 
                    alt="Digital Menu QR" 
                    className="w-48 h-48"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-black font-bold">Loading...</div>
                )}
              </div>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + '/menu/' + user._id);
                  alert('Menu link copied to clipboard!');
                }}
                className="text-xs font-black uppercase tracking-widest text-gold hover:text-foreground transition-colors border border-gold/30 px-4 py-2 rounded-xl bg-gold/5"
              >
                Copy Link
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modifiers Modal */}
      <AnimatePresence>
        {modifierModalType && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-foreground/10 rounded-[2.5rem] p-8 w-full max-w-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black uppercase tracking-tighter">
                  {modifierModalType === 'discount' ? 'Discount' : 'Additional Charge'}
                </h3>
                <button onClick={() => setModifierModalType(null)} className="text-foreground/70 hover:text-foreground"><X size={20} /></button>
              </div>

              <div className="space-y-6">
                {modifierModalType === 'discount' && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs uppercase tracking-widest text-foreground/50 font-bold">Discount</label>
                      <div className="flex rounded-md overflow-hidden border border-foreground/10 bg-card shadow-sm text-[10px] font-black">
                        <button 
                          onClick={() => setDiscountType('percentage')} 
                          className={`px-2 py-1 transition-colors ${discountType === 'percentage' ? 'bg-gold text-black' : 'text-foreground/70 hover:text-foreground'}`}
                        >
                          %
                        </button>
                        <button 
                          onClick={() => setDiscountType('flat')} 
                          className={`px-2 py-1 transition-colors ${discountType === 'flat' ? 'bg-gold text-black' : 'text-foreground/70 hover:text-foreground'}`}
                        >
                          ₹
                        </button>
                      </div>
                    </div>
                    <input 
                      type="text" 
                      value={discount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^\d*\.?\d*$/.test(val)) setDiscount(val);
                      }}
                      placeholder="0"
                      className="w-full bg-card shadow-sm p-4 rounded-xl border border-foreground/10 text-foreground font-bold focus:outline-none focus:border-gold/50"
                    />
                  </div>
                )}

                {modifierModalType === 'charge' && (
                  <div>
                    <label className="text-xs uppercase tracking-widest text-foreground/50 font-bold block mb-2">Additional Charge (₹)</label>
                    <input 
                      type="text" 
                      value={additionalCharge}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^\d*\.?\d*$/.test(val)) setAdditionalCharge(val);
                      }}
                      placeholder="0"
                      className="w-full bg-card shadow-sm p-4 rounded-xl border border-foreground/10 text-foreground font-bold focus:outline-none focus:border-gold/50"
                    />
                  </div>
                )}
              </div>

              <button 
                onClick={() => setModifierModalType(null)}
                className="mt-6 w-full p-4 bg-gold hover:scale-[1.02] active:scale-95 text-black font-black uppercase tracking-widest rounded-xl transition-all"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
