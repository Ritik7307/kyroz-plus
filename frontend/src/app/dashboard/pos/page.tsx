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
  ChefHat
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';

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
  paymentMethod: 'Cash' | 'Online';
  orderType: 'DineIn' | 'Takeaway' | 'Delivery';
  kotStatus?: 'None' | 'Pending' | 'Preparing' | 'Ready' | 'Served';
  kotId?: string;
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

const defaultSession = (tableId: string): TableSession => ({
  cart: [],
  customerName: '',
  customerPhone: '',
  discount: '',
  discountType: 'percentage',
  additionalCharge: '',
  applyGst: true,
  paymentMethod: 'Cash',
  orderType: tableId === 'quick' ? 'Takeaway' : 'DineIn',
  kotStatus: 'None',
  kotId: '',
});

export default function POSTerminal() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cart, setCart] = useState<{ dish: Dish, quantity: number, note?: string, sentQty?: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isManagementMode, setIsManagementMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userQrCode, setUserQrCode] = useState<string | null>(null);
  const [userShopName, setUserShopName] = useState<string>('KYROZ POS');
  const [userGstRate, setUserGstRate] = useState<number>(5);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showShareMenuModal, setShowShareMenuModal] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [printedBillNo, setPrintedBillNo] = useState<string>('');

  // Customer & Payment State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discount, setDiscount] = useState<string>(''); // Changed to string for better decimal handling
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [additionalCharge, setAdditionalCharge] = useState<string>('');
  const [applyGst, setApplyGst] = useState(true); // GST Toggle
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online'>('Cash');
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

  const [showAddModal, setShowAddModal] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [newDish, setNewDish] = useState({ name: '', price: '', ingredientPrice: '', category: 'Main Course', imageUrl: '' });
  const [advancedSetupData, setAdvancedSetupData] = useState({
    allowedWastagePercentage: 0,
    platesPerPacket: 10,
    totalPlates: 0,
    lowStockThreshold: 5
  });
  const [availableIngredients, setAvailableIngredients] = useState<any[]>([]);
  const [recipeIngredients, setRecipeIngredients] = useState<{itemModel: string, itemId: string, name: string, quantity: number, unit: string, costPerUnit: number}[]>([]);
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
    fetchDishes();
    fetchUser();
    
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
    setOrderType(activeSession.orderType || (savedActiveTable === 'quick' ? 'Takeaway' : 'DineIn'));
    setKotStatus(activeSession.kotStatus || 'None');
    setKotId(activeSession.kotId || '');
    
    setTimeout(() => {
      isSwitchingTable.current = false;
    }, 100);
  }, []);

  useEffect(() => {
    if (showAddModal) {
      fetchInventoryForCosting();
    }
  }, [showAddModal]);

  // Save current active table session to localStorage whenever states change
  useEffect(() => {
    if (isSwitchingTable.current) return;
    
    const currentSession: TableSession = {
      cart,
      customerName,
      customerPhone,
      discount,
      discountType,
      additionalCharge,
      applyGst,
      paymentMethod,
      orderType,
      kotStatus,
      kotId,
    };
    
    setTableSessions(prev => {
      const updated = {
        ...prev,
        [activeTable]: currentSession
      };
      localStorage.setItem('pos_table_sessions', JSON.stringify(updated));
      return updated;
    });
  }, [cart, customerName, customerPhone, discount, discountType, additionalCharge, applyGst, paymentMethod, orderType, kotStatus, kotId]);

  const switchTable = (targetTableId: string) => {
    isSwitchingTable.current = true;
    
    // Save current active states into current session
    const currentSession: TableSession = {
      cart,
      customerName,
      customerPhone,
      discount,
      discountType,
      additionalCharge,
      applyGst,
      paymentMethod,
      orderType,
      kotStatus,
      kotId,
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
    setOrderType(targetSession.orderType || (targetTableId === 'quick' ? 'Takeaway' : 'DineIn'));
    setKotStatus(targetSession.kotStatus || 'None');
    setKotId(targetSession.kotId || '');
    
    setActiveTable(targetTableId);
    localStorage.setItem('pos_active_table', targetTableId);
    
    setTimeout(() => {
      isSwitchingTable.current = false;
    }, 100);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUser(data);
      setUserRole(data.role);
      if (data.paymentQrCode) setUserQrCode(data.paymentQrCode);
      if (data.shopName) setUserShopName(data.shopName);
      if (data.gstPercentage !== undefined) setUserGstRate(data.gstPercentage);
    } catch (err) {
      console.error('Failed to fetch user', err);
    }
  };

  const fetchDishes = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/dishes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setDishes(data);
      } else {
        setDishes([]);
      }
    } catch (err) {
      console.error('Failed to fetch dishes', err);
      setDishes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryForCosting = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/inventory`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      const allIngredients = [
        ...(data.rawMaterials || []).map((i: any) => ({ ...i, model: 'RawMaterial' })),
        ...(data.semiFinishedGoods || []).map((i: any) => ({ ...i, model: 'SemiFinishedGood' })),
        ...(data.premixes || []).map((i: any) => ({ ...i, model: 'Premix' })),
        ...(data.packaging || []).map((i: any) => ({ ...i, model: 'Packaging' }))
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

      const payload = {
        dishDetails: {
          name: newDish.name,
          price: Number(newDish.price) || 0,
          ingredientPrice: Number(newDish.ingredientPrice) || 0,
          category: newDish.category || 'Main Course',
          imageUrl: currentImageUrl,
          allowedWastagePercentage: 0
        },
        recipeDetails: { ingredients: [] },
        inventoryDetails: {
          platesPerPacket: Number(advancedSetupData.platesPerPacket) || 10,
          totalPlates: Number(advancedSetupData.totalPlates) || 0,
          lowStockThreshold: Number(advancedSetupData.lowStockThreshold) || 5
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
      if (res.ok) {
        setShowAddModal(false);
        setSetupStep(1);
        setNewDish({ name: '', price: '', ingredientPrice: '', category: 'Main Course', imageUrl: '' });
        setAdvancedSetupData({ allowedWastagePercentage: 0, platesPerPacket: 10, totalPlates: 0, lowStockThreshold: 5 });
        setRecipeIngredients([]);
        fetchDishes();
      } else {
        alert('Failed to save dish with advanced setup.');
      }
    } catch (err) {
      console.error('Failed to add dish', err);
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
        fetchDishes();
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
      if (res.ok) fetchDishes();
    } catch (err) {
      console.error('Failed to delete dish', err);
    }
  };

  const addToCart = (dish: Dish) => {
    if (isManagementMode) return;
    setCart(prev => {
      const existing = prev.find(item => item.dish._id === dish._id);
      if (existing) {
        return prev.map(item => item.dish._id === dish._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { dish, quantity: 1, sentQty: 0 }];
    });
    setCheckoutSuccess(false); // Reset success if new items added
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.dish._id === id) {
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

  const total = cart.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);
  
  const parsedDiscount = parseFloat(discount) || 0;
  const discountAmount = discountType === 'flat' 
    ? parsedDiscount 
    : total * (parsedDiscount / 100);

  const afterDiscount = Math.max(0, total - discountAmount);
  const gstAmount = applyGst ? afterDiscount * (userGstRate / 100) : 0;
  const parsedAdditionalCharge = parseFloat(additionalCharge) || 0;
  const grandTotal = Math.round(afterDiscount + gstAmount + parsedAdditionalCharge);

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(dishes.map(d => d.category)))];
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    return dishes.filter(d => 
      (activeCategory === 'All' || d.category === activeCategory) &&
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dishes, activeCategory, searchQuery]);

  const isManager = ['admin', 'manager', 'user'].includes(userRole);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (paymentMethod === 'Online' && userQrCode && !showQrModal) {
      setShowQrModal(true);
      return;
    }

    // Zero Latency Checkout: Generate bill no locally and print immediately
    const tempBillNo = `BILL-${Date.now()}`;
    setPrintedBillNo(tempBillNo);
    setPrintType('bill');
    
    setIsProcessingCheckout(true);
    
    setTimeout(() => {
      window.print();
      setPrintType(null);
      setIsProcessingCheckout(false);
      
      // Since browsers don't tell us if the user clicked Print or Cancel,
      // we ask them if it was successful before finalizing the order.
      if (window.confirm("Did the bill print successfully? Click OK to complete the order, or Cancel to go back and edit the cart.")) {
        
        // Auto-send WhatsApp message if customer phone is provided
        if (customerPhone && customerPhone.length >= 10) {
          shareOrderOnWhatsApp(tempBillNo);
        }
        
        setCheckoutSuccess(true);
        setCart([]);
        
        // Update session for active table
        // updateSession(activeTable, { cart: [] });

        // Process the checkout in the background
        const token = localStorage.getItem('token');
        fetch(`${API_URL}/api/orders/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            cart: cart.map(item => ({ dishId: item.dish._id, quantity: item.quantity, note: item.note })),
            customerName, customerPhone, discount, discountType, additionalCharge,
            applyGst, paymentMethod, orderType,
            kotId, // Send KOT ID if it exists so backend can link them
            tempBillNo // Send temp bill no so backend can use it
          })
        }).then(res => {
          if (!res.ok) console.error('Background checkout failed');
        }).catch(err => console.error('Background checkout error', err));
      } else {
        // User cancelled, clear the printed bill number but keep the cart
        setPrintedBillNo('');
      }
    }, 100);
  };

  // Poll active KOT status
  useEffect(() => {
    if (!kotId || kotId === '') return;
    
    let active = true;
    const pollKotStatus = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_URL}/api/kots`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const activeKots = await res.json();
          if (Array.isArray(activeKots)) {
            const currentKot = activeKots.find((k: any) => k._id === kotId);
            if (currentKot && active) {
              setKotStatus(currentKot.status);
            } else if (!currentKot && active) {
              // If not active, check history to see if it became Served/Cancelled
              const histRes = await fetch(`${API_URL}/api/kots/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (histRes.ok) {
                const historyKots = await histRes.json();
                const matched = historyKots.find((k: any) => k._id === kotId);
                if (matched && active) {
                  setKotStatus(matched.status);
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Error polling KOT status:', err);
      }
    };
    
    pollKotStatus();
    const interval = setInterval(pollKotStatus, 8000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [kotId]);

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

  const handleSendKot = async () => {
    // Filter out items that have unsent quantities
    const unsentItems = cart.map(item => {
      const unsentQty = item.quantity - (item.sentQty || 0);
      return {
        dish: item.dish,
        quantity: unsentQty,
        note: item.note || ''
      };
    }).filter(item => item.quantity > 0);

    if (unsentItems.length === 0) {
      alert("No new items to send to kitchen.");
      return;
    }
    
    setIsSendingKot(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/kots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: unsentItems.map(item => ({
            dishId: item.dish._id,
            quantity: item.quantity,
            note: item.note
          })),
          tableNumber: activeTable === 'quick' ? 'Quick Bill' : tables.find(t => t.id === activeTable)?.name || activeTable,
          orderType: orderType
        })
      });
      const data = await res.json();
      if (res.ok) {
        setKotStatus('Pending');
        setKotId(data.kot?._id || '');
        setPrintingKot(data.kot);
        setPrintType('kot');
        // Mark all items as sent in state
        setCart(prev => prev.map(item => ({
          ...item,
          sentQty: item.quantity
        })));
        
        // Trigger automatic printing of the KOT ticket
        setTimeout(() => {
          window.print();
        }, 300);
      } else {
        alert(data.error || 'Failed to send KOT');
      }
    } catch (err) {
      console.error('Send KOT Error:', err);
      alert('Failed to send KOT');
    } finally {
      setIsSendingKot(false);
    }
  };

  const shareOrderOnWhatsApp = (billNumberToUse?: string) => {
    if (cart.length === 0) return;
    
    if (!customerPhone) {
      alert("Please enter customer phone number in the checkout panel to send WhatsApp bill.");
      return;
    }

    const itemsList = cart.map(item => `• ${item.dish.name} (x${item.quantity}) - ₹${item.dish.price * item.quantity}`).join('\n');
    
    // Using string interpolation for bill number to ensure it works whether called manually or automatically
    const activeBillNo = (typeof billNumberToUse === 'string' && billNumberToUse) ? billNumberToUse : printedBillNo;
    
    const message = `Thank you ${customerName || 'Customer'}, 👋\n\nHere are your bill details:\n\n*Bill No:* #${activeBillNo || 'N/A'}\n\n*ORDER DETAILS:*\n${itemsList}\n\n*Subtotal: ₹${total}*\n${discountAmount > 0 ? `*Discount: ${discountType === 'flat' ? `₹${parsedDiscount}` : `${parsedDiscount}%`} (₹${Math.round(discountAmount)})*\n` : ''}${applyGst ? `*GST (${userGstRate}%): ₹${gstAmount.toFixed(2)}*\n` : ''}${parsedAdditionalCharge > 0 ? `*Additional Charge: ₹${parsedAdditionalCharge}*\n` : ''}*Grand Total: ₹${grandTotal}*\n\nThank you for visiting!\n\n_Sent via KYROZ_`;
    
    const encodedMessage = encodeURIComponent(message);
    const formattedPhone = customerPhone.startsWith('+') ? customerPhone.substring(1) : (customerPhone.length === 10 ? `91${customerPhone}` : customerPhone);
    window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, '_blank');
  };

  const renderCartContent = (isDrawer = false) => {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/5 shrink-0 flex items-center justify-between">
          <h2 className="text-xl font-black flex items-center gap-3 text-white">
            <ShoppingCart className="text-gold" /> ORDER SUMMARY
          </h2>
          {isDrawer && (
            <button onClick={() => setIsCartOpen(false)} className="p-2 text-white/40 hover:text-white transition-colors">
              <X size={24} />
            </button>
          )}
        </div>

        {/* Scrollable Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 custom-scrollbar">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div
                key={item.dish._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5"
              >
                <div className="flex-1 pr-2">
                  <h4 className="font-bold text-xs">{item.dish.name}</h4>
                  <p className="text-[10px] text-white/40">₹{item.dish.price} x {item.quantity}</p>
                  
                  {/* Sent vs Unsent badges */}
                  {item.sentQty && item.sentQty > 0 ? (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[8px] bg-green-500/10 border border-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-black uppercase">
                        {item.sentQty} Sent
                      </span>
                      {item.quantity - item.sentQty > 0 && (
                        <span className="text-[8px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-black uppercase animate-pulse">
                          {item.quantity - item.sentQty} Unsent
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center mt-1.5">
                      <span className="text-[8px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-black uppercase">
                        Unsent (New)
                      </span>
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Add Note (e.g. less spicy)"
                    value={item.note || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCart(prev => prev.map(i => i.dish._id === item.dish._id ? { ...i, note: val } : i));
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 mt-1.5 text-[9px] text-white/60 focus:outline-none focus:border-gold/30"
                  />
                </div>
                <div className="flex items-center gap-2 bg-black/40 rounded-xl p-1 border border-white/5 shrink-0">
                  <button onClick={() => updateQuantity(item.dish._id, -1)} className="text-white/40 hover:text-white"><Minus size={12} /></button>
                  <span className="text-xs font-bold min-w-[16px] text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.dish._id, 1)} className="text-gold hover:text-gold/80"><Plus size={12} /></button>
                </div>
                <div className="ml-3 font-black text-xs w-14 text-right shrink-0">₹{item.dish.price * item.quantity}</div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-white/5 space-y-4 py-10">
              <Utensils size={48} />
              <p className="font-black uppercase tracking-widest text-[10px]">Select items to begin bill</p>
            </div>
          )}
        </div>

        {/* Checkout Form */}
        <div className={`p-4 sm:p-6 bg-black/40 border-t border-white/5 space-y-3 sm:space-y-4 shrink-0 overflow-y-auto custom-scrollbar transition-all duration-300 ${showAdvancedOptions ? 'max-h-[85%] lg:max-h-[80%]' : 'max-h-[35%] lg:max-h-[30%]'}`}>
          
          <button 
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="w-full flex items-center justify-between text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors py-1"
          >
            <span>More Checkout Options</span>
            <ChevronRight className={`transform transition-transform ${showAdvancedOptions ? 'rotate-90' : ''}`} size={14} />
          </button>

          <AnimatePresence>
            {showAdvancedOptions && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 overflow-hidden pt-1"
              >
                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <input 
                      type="text" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Customer Name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50 placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <input 
                      type="tel" 
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Phone No."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50 placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Discount</span>
                    <div className="flex rounded-md overflow-hidden border border-white/10 bg-white/5 text-[9px] font-black">
                      <button 
                        onClick={() => setDiscountType('percentage')} 
                        type="button"
                        className={`px-1.5 py-0.5 transition-colors ${discountType === 'percentage' ? 'bg-gold text-black' : 'text-white/40'}`}
                      >
                        %
                      </button>
                      <button 
                        onClick={() => setDiscountType('flat')} 
                        type="button"
                        className={`px-1.5 py-0.5 transition-colors ${discountType === 'flat' ? 'bg-gold text-black' : 'text-white/40'}`}
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
                      if (val === '' || /^\d*\.?\d*$/.test(val)) {
                        setDiscount(val);
                      }
                    }}
                    placeholder="0"
                    className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-right text-gold font-bold focus:outline-none"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Add. Charge (₹)</span>
                  <input 
                    type="text" 
                    value={additionalCharge}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d*\.?\d*$/.test(val)) {
                        setAdditionalCharge(val);
                      }
                    }}
                    placeholder="0"
                    className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-right text-white font-bold focus:outline-none"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Apply GST ({userGstRate}%)</span>
                  <button 
                    onClick={() => setApplyGst(!applyGst)}
                    className={`w-12 h-6 rounded-full transition-all relative ${applyGst ? 'bg-gold' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${applyGst ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest pl-1">Order Type</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setOrderType('DineIn')}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        orderType === 'DineIn' ? 'bg-gold text-black border-gold' : 'bg-white/5 text-white/40 border-white/10'
                      }`}
                    >
                      Dine In
                    </button>
                    <button 
                      onClick={() => setOrderType('Takeaway')}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        orderType === 'Takeaway' ? 'bg-gold text-black border-gold' : 'bg-white/5 text-white/40 border-white/10'
                      }`}
                    >
                      Takeaway
                    </button>
                    <button 
                      onClick={() => setOrderType('Delivery')}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        orderType === 'Delivery' ? 'bg-gold text-black border-gold' : 'bg-white/5 text-white/40 border-white/10'
                      }`}
                    >
                      Delivery
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pb-2">
                  <button 
                    onClick={() => setPaymentMethod('Cash')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      paymentMethod === 'Cash' ? 'bg-gold text-black border-gold' : 'bg-white/5 text-white/40 border-white/10'
                    }`}
                  >
                    Cash
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('Online')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      paymentMethod === 'Online' ? 'bg-gold text-black border-gold' : 'bg-white/5 text-white/40 border-white/10'
                    }`}
                  >
                    Online
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

            <div className="flex justify-between items-end pt-2 border-t border-white/5">
              <span className="text-sm font-black uppercase tracking-widest">Grand Total</span>
              <div className="text-right">
                {discountAmount > 0 && (
                  <p className="text-[10px] text-red-500 font-bold line-through mb-1">₹{Math.round(total * (applyGst ? (1 + userGstRate / 100) : 1))}</p>
                )}
                <span className="text-3xl font-black text-gold">
                  ₹{grandTotal}
                </span>
              </div>
            </div>

          {/* Packaging Preview Section Hidden (still works in background) */}

          {/* KOT Status Badge */}
          {kotStatus !== 'None' && (
            <div className="bg-gold/5 border border-gold/25 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  kotStatus === 'Ready' 
                    ? 'bg-green-500' 
                    : kotStatus === 'Preparing' 
                      ? 'bg-orange-500' 
                      : 'bg-blue-500 animate-pulse'
                }`} />
                <div className="text-left">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">KOT Pipeline</p>
                  <p className="text-xs font-black text-gold uppercase mt-0.5">{kotStatus}</p>
                </div>
              </div>
              {kotStatus === 'Ready' && (
                <span className="text-[9px] bg-green-500 text-black px-2.5 py-1 rounded-full font-black animate-bounce tracking-wider">
                  READY TO SERVE
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
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
                  setOrderType('DineIn');
                  setCheckoutSuccess(false);
                  setKotStatus('None');
                  setKotId('');
                }}
                className="py-3.5 rounded-xl border border-red-500/20 text-red-500 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500/5 transition-all"
              >
                Clear
              </button>
              <button 
                onClick={() => shareOrderOnWhatsApp()}
                disabled={cart.length === 0}
                className="py-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 font-bold text-[10px] uppercase tracking-widest hover:bg-green-500/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={14} /> WhatsApp
              </button>
            </div>

            {/* Checkout & KOT Actions */}
            {!checkoutSuccess ? (
              <div className="flex gap-3 items-center w-full">
                {(() => {
                  const hasUnsentItems = cart.some(item => item.quantity - (item.sentQty || 0) > 0);
                  return (
                    <button 
                      onClick={handleSendKot}
                      disabled={cart.length === 0 || isSendingKot || !hasUnsentItems}
                      className={`flex-1 py-3.5 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all border flex items-center justify-center gap-2 ${
                        !hasUnsentItems && cart.length > 0
                          ? 'bg-green-500/10 border-green-500/20 text-green-500 cursor-not-allowed'
                          : 'bg-white/5 border-gold/30 text-gold hover:bg-gold hover:text-black hover:border-gold hover:scale-[1.01]'
                      }`}
                    >
                      {isSendingKot ? 'Sending...' : !hasUnsentItems && cart.length > 0 ? '✔ Sent' : <><ChefHat size={14} /> Send KOT</>}
                    </button>
                  );
                })()}

                <button 
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="flex-1 py-3.5 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 bg-gold text-black hover:scale-[1.02] active:scale-95"
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
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Order Processed Successfully</p>
                    <p className="text-[9px] text-green-500/60 font-bold">Receipt printed & data saved.</p>
                  </div>
                </motion.div>

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
                    setOrderType('DineIn');
                    setCheckoutSuccess(false);
                    setKotStatus('None');
                    setKotId('');
                    setPrintedBillNo('');
                    if (isDrawer) setIsCartOpen(false);
                  }}
                  className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl bg-white/10 text-white border border-white/10 hover:bg-white/20 mb-3"
                >
                  Start New Order
                </button>

                <button 
                  onClick={() => setCheckoutSuccess(false)}
                  className="w-full py-3 rounded-xl border border-white/5 text-white/40 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all"
                >
                  Add More Items / Edit
                </button>
              </>
            )}

            {userQrCode && (
              <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/10 mt-4 mb-4">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-3">Shop Payment QR</p>
                <img src={userQrCode} alt="Payment QR" className="w-24 h-24 object-contain rounded-lg" />
              </div>
            )}


          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full relative">
      <style jsx global>{`
        @media print {
          /* Hide EVERYTHING in the body using visibility */
          body {
            visibility: hidden !important;
            background: white !important;
          }
          
          /* Show ONLY the receipt container and its children */
          .receipt-container {
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
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
          <div className="max-w-[80mm] mx-auto font-mono text-xs text-black p-6 bg-white">
            <div className="text-center border-b-2 border-black pb-2 mb-3">
              <h1 className="text-xl font-black uppercase tracking-tight text-center">KITCHEN ORDER TICKET</h1>
              <p className="text-sm font-bold uppercase tracking-widest text-black mt-1">KOT #{printingKot.kotNumber}</p>
              <p className="text-[10px] mt-0.5">{new Date(printingKot.createdAt).toLocaleString()}</p>
            </div>

            <div className="border-b border-black pb-2 mb-3 space-y-1">
              <div className="flex justify-between text-xs font-black">
                <span>SOURCE:</span>
                <span>{printingKot.tableNumber}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>ORDER TYPE:</span>
                <span className="font-bold uppercase">{printingKot.orderType}</span>
              </div>
            </div>

            <table className="w-full text-xs mb-4">
              <thead>
                <tr className="border-b border-black text-left font-black">
                  <th className="pb-1">Item Name</th>
                  <th className="pb-1 text-right">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {printingKot.items.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-2 pr-2 leading-tight">
                      <span className="font-bold">{item.dishId?.name || 'Unknown Dish'}</span>
                      {item.note && (
                        <div className="text-[10px] italic mt-0.5 font-bold">
                          * Note: {item.note}
                        </div>
                      )}
                    </td>
                    <td className="py-2 text-right font-black text-sm">x{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {printingKot.packaging && printingKot.packaging.length > 0 && (
              <div className="border-t border-black pt-2 mt-2">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1.5">Packaging Items Needed:</p>
                <div className="space-y-1 text-[10px] font-bold">
                  {printingKot.packaging.map((pkg: any, idx: number) => (
                    <div key={idx} className="flex justify-between">
                      <span>[ ] {pkg.name}</span>
                      <span>x{pkg.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-dashed border-black pt-3 mt-6 text-center text-[9px] opacity-60">
              <p className="uppercase tracking-[0.2em]">SOP & Prep Checklist Printed</p>
              <p className="uppercase tracking-[0.3em] font-black mt-0.5 text-[8px]">Powered by KYROZ</p>
            </div>
          </div>
        ) : (
          <div className="max-w-[80mm] mx-auto font-mono text-xs text-black p-6 bg-white">
            {/* Header section - All Centered like screenshot */}
            <div className="text-center mb-6 space-y-1">
              <h1 className="text-2xl font-black uppercase tracking-tight">{userShopName}</h1>
              {user?.shopAddress && <p className="text-[10px] uppercase font-bold">{user.shopAddress}</p>}
              <p className="text-[10px] font-bold">Receipt / Bill {printedBillNo ? `#${printedBillNo}` : ''}</p>
              <p className="text-[10px]">{new Date().toLocaleString()}</p>
              
              {/* Customer Details - Centered as well for clean look */}
              {(customerName || customerPhone) && (
                <div className="pt-2 border-t border-black/10 mt-2">
                  {customerName && <p className="font-black uppercase tracking-tighter text-[11px]">{customerName}</p>}
                  {customerPhone && <p className="text-[10px]">{customerPhone}</p>}
                </div>
              )}
            </div>

            <div className="border-t-2 border-b-2 border-black py-2 mb-4">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-left border-b border-black">
                    <th className="pb-1 font-black">Item</th>
                    <th className="pb-1 text-center font-black">Qty</th>
                    <th className="pb-1 text-right font-black">Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <tr key={idx} className="border-b border-black/5 last:border-0">
                      <td className="py-2 pr-2 leading-tight">{item.dish.name}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right font-bold">₹{item.dish.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-1.5 mb-6">
              {activeTable !== 'quick' && (
                <div className="flex justify-between items-center text-[11px] font-black border-b border-black/10 pb-1 mb-2">
                  <span className="uppercase tracking-widest">TABLE:</span>
                  <span>{tables.find(t => t.id === activeTable)?.name}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold uppercase tracking-widest">Subtotal:</span>
                <span className="font-bold">₹{total}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-[11px] text-red-600">
                  <span className="font-bold uppercase tracking-widest">Discount ({discountType === 'flat' ? '₹' : ''}{discount}{discountType === 'percentage' ? '%' : ''}):</span>
                  <span className="font-bold">-₹{Math.round(discountAmount)}</span>
                </div>
              )}
              {applyGst && (
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold uppercase tracking-widest">Taxes ({userGstRate}%):</span>
                  <span className="font-bold">₹{Math.round(gstAmount)}</span>
                </div>
              )}
              {parsedAdditionalCharge > 0 && (
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold uppercase tracking-widest">Add. Charge:</span>
                  <span className="font-bold">₹{parsedAdditionalCharge}</span>
                </div>
              )}
              <div className="border-t border-black pt-2 mt-2">
                <div className="flex justify-between items-center text-lg font-black tracking-tight">
                  <span>TOTAL:</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-black pt-4 mb-8 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Order Type: {orderType}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Payment Method: {paymentMethod}</p>
            </div>

            {userQrCode && (
              <div className="flex flex-col items-center mb-8">
                <p className="text-[8px] uppercase tracking-widest mb-3 font-bold opacity-60">Scan to Pay Online</p>
                <div className="border-4 border-black p-2 rounded-2xl">
                  <img src={userQrCode} alt="QR Code" className="w-32 h-32" />
                </div>
              </div>
            )}

            <div className="text-center text-[10px] space-y-1 opacity-60 font-bold">
              <p className="uppercase tracking-widest">Thank you for visiting!</p>
              <p className="uppercase tracking-[0.3em] text-[8px]">Powered by KYROZ</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 no-print items-start w-full">
        {/* Floating Cart Button (Mobile & Tablet only) */}
        <div className="fixed bottom-6 right-6 z-[60] lg:hidden">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-16 h-16 bg-gold rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)] text-black relative hover:scale-110 active:scale-95 transition-all group"
          >
            <ShoppingCart size={24} className="group-hover:rotate-12 transition-transform" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-background">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Left Column: Menu list */}
        <div className="flex-1 w-full min-w-0 flex flex-col">
          <div className="bg-card glass-card p-4 md:p-6 rounded-[2rem] border border-white/5 space-y-4 md:space-y-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl md:text-2xl font-black flex items-center gap-3">
                <Utensils className="text-gold" /> {isManagementMode ? 'SHOP MANAGER' : 'DISH MENU'}
              </h2>
              <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-gold/50"
                  />
                </div>
                {isManager && (
                  <>
                    <button 
                      onClick={() => setShowShareMenuModal(true)}
                      className="p-2.5 md:p-3 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white transition-all flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest shrink-0"
                    >
                      <Share2 size={16} /> Share Menu
                    </button>
                    <button 
                      onClick={() => setIsManagementMode(!isManagementMode)}
                      className={`p-2.5 md:p-3 rounded-xl border transition-all flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest shrink-0 ${
                        isManagementMode ? 'bg-gold text-black border-gold' : 'bg-white/5 text-white/40 border-white/10'
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
              <div className="border-b border-white/5 pb-4 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest pl-1">TABLE SELECTION (BILLING SESSION)</label>
                  {isManager && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleAddTable}
                        className="text-[9px] font-black text-gold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1"
                      >
                        <Plus size={10} /> Add Table
                      </button>
                      <button 
                        onClick={handleRemoveLastTable}
                        disabled={tables.length <= 1}
                        className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Minus size={10} /> Remove Table
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
                    
                    const tableSubtotal = hasItems 
                      ? session.cart.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0)
                      : 0;

                    return (
                      <button
                        key={t.id}
                        onClick={() => switchTable(t.id)}
                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border flex items-center gap-2 relative group ${
                          isActive
                            ? 'bg-gold text-black border-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                            : hasItems
                              ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                              : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span>{t.name}</span>
                        {tableKotStatus && tableKotStatus !== 'None' && (
                          <span className={`w-2 h-2 rounded-full ${
                            tableKotStatus === 'Ready' 
                              ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' 
                              : tableKotStatus === 'Preparing' 
                                ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' 
                                : 'bg-blue-500 animate-pulse'
                          }`} title={`KOT: ${tableKotStatus}`} />
                        )}
                        {hasItems && (
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-bold ${isActive ? 'bg-black text-gold' : 'bg-red-500 text-white'}`}>
                            ₹{tableSubtotal}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 overflow-hidden">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                      activeCategory === cat ? 'bg-gold text-black border-gold' : 'bg-white/10 text-white/70 border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {isManagementMode && (
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                >
                  <Plus size={16} /> Add
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pr-1">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/20 gap-4">
                <Loader2 className="animate-spin" size={48} />
                <p className="font-black uppercase tracking-widest text-sm">Loading Menu...</p>
              </div>
            ) : filteredDishes.map(dish => {
              const quantity = getItemQuantity(dish._id);
              return (
                <motion.div
                  key={dish._id}
                  className={`bg-card glass-card rounded-3xl border transition-all flex flex-col overflow-hidden h-[280px] ${
                    isManagementMode ? 'border-white/10' : 'border-white/5 hover:border-gold/30'
                  }`}
                >
                  <div className="h-32 relative overflow-hidden bg-white/5">
                    {dish.imageUrl ? (
                      <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    {isManagementMode && (
                      <div className="absolute top-2 right-2 flex gap-1.5">
                        <button onClick={() => setEditingDish(dish)} className="p-2 bg-black/60 rounded-lg text-white hover:text-gold border border-white/10"><Edit size={12}/></button>
                        <button onClick={() => handleDeleteDish(dish._id)} className="p-2 bg-black/60 rounded-lg text-white hover:text-red-500 border border-white/10"><Trash2 size={12}/></button>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <h3 className="font-bold text-sm leading-tight line-clamp-2">{dish.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-white">₹{dish.price}</span>
                      {!isManagementMode && (
                        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                          {quantity > 0 ? (
                            <>
                              <button onClick={() => updateQuantity(dish._id, -1)} className="w-6 h-6 bg-white/5 rounded-lg flex items-center justify-center text-white/60"><Minus size={12} /></button>
                              <span className="text-xs font-black min-w-[16px] text-center">{quantity}</span>
                              <button onClick={() => addToCart(dish)} className="w-6 h-6 bg-gold/10 rounded-lg flex items-center justify-center text-gold"><Plus size={12} /></button>
                            </>
                          ) : (
                            <button onClick={() => addToCart(dish)} className="px-3 py-1 bg-gold/10 text-gold rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-black">Add</button>
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

        {/* Right Column: Permanent Sidebar Cart on Desktop */}
        <div className="hidden lg:flex w-[450px] shrink-0 bg-card glass-card border border-white/10 rounded-[2.5rem] flex-col overflow-hidden h-[calc(100vh-12rem)] sticky top-28 shadow-xl">
          {renderCartContent(false)}
        </div>
      </div>

      {/* CART OVERLAY - Slide from Right for Mobile & Tablet (below lg) */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-full max-w-md bg-card glass-card h-full border-l border-white/10 flex flex-col overflow-hidden shadow-2xl"
            >
              {renderCartContent(true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODALS (Simplified for clarity) */}
      <AnimatePresence>
        {(showAddModal || editingDish) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-white/10 rounded-[2.5rem] p-8 w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black uppercase tracking-tighter">{editingDish ? 'Edit Item' : 'New Item'}</h3>
                <button onClick={() => { setShowAddModal(false); setEditingDish(null); }}><X /></button>
              </div>
              <div className="space-y-4">
                {editingDish ? (
                  <>
                    <input type="text" value={editingDish.name} onChange={(e) => setEditingDish({...editingDish, name: e.target.value})} placeholder="Item Name" className="w-full bg-white/5 p-4 rounded-xl border border-white/10" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="number" value={editingDish.price} onChange={(e) => setEditingDish({...editingDish, price: Number(e.target.value)})} placeholder="Price" className="w-full bg-white/5 p-4 rounded-xl border border-white/10" />
                      <input type="number" value={editingDish.ingredientPrice} onChange={(e) => setEditingDish({...editingDish, ingredientPrice: Number(e.target.value)})} placeholder="Cost" className="w-full bg-white/5 p-4 rounded-xl border border-white/10" />
                    </div>
                    {editingDish.ingredientPrice > 0 && (
                      <p className="text-[10px] text-white/50 italic px-2">
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
                        <div key={step} className={`flex-1 h-1 rounded-full ${setupStep >= step ? 'bg-gold' : 'bg-white/10'}`} />
                      ))}
                    </div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gold mb-4">
                      {setupStep === 1 && "Step 1: Basic Details"}
                      {setupStep === 2 && "Step 2: Costing & Wastage"}
                      {setupStep === 3 && "Step 3: Inventory Master"}
                    </p>

                    {setupStep === 1 && (
                      <div className="space-y-4">
                        <input type="text" value={newDish.name} onChange={(e) => setNewDish({...newDish, name: e.target.value})} placeholder="Item Name *" className="w-full bg-white/5 p-4 rounded-xl border border-white/10" required />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="number" value={newDish.price} onChange={(e) => setNewDish({...newDish, price: e.target.value})} placeholder="Selling Price *" className="w-full bg-white/5 p-4 rounded-xl border border-white/10" required />
                          
                          {isAddingNewCategory ? (
                            <div className="relative">
                              <input 
                                type="text" 
                                value={newDish.category} 
                                onChange={(e) => setNewDish({...newDish, category: e.target.value})} 
                                placeholder="New Category Name" 
                                className="w-full bg-white/5 p-4 rounded-xl border border-white/10 pr-10" 
                                autoFocus
                              />
                              <button 
                                onClick={() => { setIsAddingNewCategory(false); setNewDish({...newDish, category: ''}); }} 
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
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
                                }
                              }}
                              className="w-full bg-black/40 p-4 rounded-xl border border-white/10 text-sm"
                            >
                              <option value="" disabled>Select Category</option>
                              {Array.from(new Set(dishes.map(d => d.category))).filter(Boolean).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                              <option value="ADD_NEW" className="text-gold font-bold">+ Add New Category</option>
                            </select>
                          )}
                        </div>
                        <button onClick={() => { if(newDish.name && newDish.price) setSetupStep(2); else alert('Name and Price are mandatory'); }} className="w-full py-4 bg-gold text-black font-black uppercase rounded-xl">Next: Costing</button>
                      </div>
                    )}

                    {setupStep === 2 && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                          <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold block">Estimated Dish Cost (₹)</label>
                          <input type="number" value={newDish.ingredientPrice} onChange={(e) => setNewDish({...newDish, ingredientPrice: e.target.value})} placeholder="Costing Amount *" className="w-full bg-black/40 p-3 rounded-lg border border-white/10" />
                          <p className="text-[9px] text-white/40">You can add specific ingredients later in the Costing Master.</p>
                        </div>
                        <div className="flex gap-4">
                          <button onClick={() => setSetupStep(1)} className="w-1/3 py-4 bg-white/5 text-white font-black uppercase rounded-xl hover:bg-white/10">Back</button>
                          <button onClick={() => setSetupStep(3)} className="w-2/3 py-4 bg-gold text-black font-black uppercase rounded-xl">Next: Inventory</button>
                        </div>
                      </div>
                    )}

                    {setupStep === 3 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold pl-1">Initial Total Plates</label>
                            <input type="number" value={advancedSetupData.totalPlates} onChange={(e) => setAdvancedSetupData({...advancedSetupData, totalPlates: Number(e.target.value)})} placeholder="0" className="w-full bg-white/5 p-4 rounded-xl border border-white/10" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold pl-1">Plates Per Packet</label>
                            <input type="number" value={advancedSetupData.platesPerPacket} onChange={(e) => setAdvancedSetupData({...advancedSetupData, platesPerPacket: Number(e.target.value)})} placeholder="10" className="w-full bg-white/5 p-4 rounded-xl border border-white/10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold pl-1">Low Stock Threshold (Packets)</label>
                          <input type="number" value={advancedSetupData.lowStockThreshold} onChange={(e) => setAdvancedSetupData({...advancedSetupData, lowStockThreshold: Number(e.target.value)})} placeholder="5" className="w-full bg-white/5 p-4 rounded-xl border border-white/10" />
                        </div>
                        <div className="flex gap-4">
                          <button onClick={() => setSetupStep(2)} className="w-1/3 py-4 bg-white/5 text-white font-black uppercase rounded-xl hover:bg-white/10">Back</button>
                          <button onClick={handleAddDish} className="w-2/3 py-4 bg-gold text-black font-black uppercase rounded-xl">Save Setup</button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR PAYMENT MODAL */}
      <AnimatePresence>
        {showQrModal && userQrCode && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm flex flex-col items-center">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Scan to Pay</h3>
              <p className="text-sm text-white/60 mb-6 text-center">Amount Due: <span className="text-gold font-black text-xl">₹{grandTotal}</span></p>
              
              <div className="bg-white p-4 rounded-3xl mb-8 w-64 h-64 flex items-center justify-center">
                <img src={userQrCode} alt="Payment QR" className="w-full h-full object-contain" />
              </div>

              <div className="flex w-full gap-4">
                <button 
                  onClick={() => setShowQrModal(false)}
                  className="flex-1 py-4 bg-white/5 text-white font-black uppercase rounded-xl border border-white/10 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessingCheckout}
                  className="flex-[2] py-4 bg-green-500 text-white font-black uppercase rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowShareMenuModal(false)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-card glass-card border border-white/10 p-8 rounded-3xl w-full max-w-sm flex flex-col items-center text-center"
            >
              <button 
                onClick={() => setShowShareMenuModal(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-16 h-16 bg-gold-gradient rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                <Utensils size={32} className="text-black" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight mb-2">Digital Menu</h2>
              <p className="text-xs text-white/60 mb-8 font-bold">Ask customers to scan this QR code to view your live digital menu.</p>
              
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
                className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-white transition-colors border border-gold/30 px-4 py-2 rounded-xl bg-gold/5"
              >
                Copy Link
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
