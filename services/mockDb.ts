import { Member, Transaction, Claim, UserRole, ClaimStatus, TransactionStatus, NotificationPreferences } from '../types';

// Helper to generate recent dates
const getRelativeDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

// --- Interfaces for New Features ---
export interface AppSettings {
  heroBgUrl: string;
  loginBgUrl: string;
  logoUrl?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  category: string;
  title: string;
  year: number;
}

export interface LeadershipMember {
  id: string;
  name: string;
  roleKey: string;
  imgUrl: string;
}

// --- Seed Data ---
const SEED_SETTINGS: AppSettings = {
  heroBgUrl: '/images/hero.jpg',
  loginBgUrl: '/images/login.jpg',
  logoUrl: '/images/logo.png'
};

const SEED_GALLERY: GalleryItem[] = [
    { id: 'g1', url: "https://images.unsplash.com/photo-1542642831-255e2c595088?q=80&w=1000&auto=format&fit=crop", category: 'MEETINGS', title: "Monthly Assembly", year: 2024 },
    { id: 'g2', url: "https://images.unsplash.com/photo-1489712310660-3162b7405e6b?q=80&w=1000&auto=format&fit=crop", category: 'FEASTS', title: "Annual Feast", year: 2023 },
    { id: 'g3', url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop", category: 'MEETINGS', title: "Committee Discussion", year: 2024 },
    { id: 'g4', url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1000&auto=format&fit=crop", category: 'SERVICE', title: "Community Cleaning", year: 2023 },
    { id: 'g5', url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000&auto=format&fit=crop", category: 'FEASTS', title: "Traditional Holiday", year: 2024 },
    { id: 'g6', url: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?q=80&w=1000&auto=format&fit=crop", category: 'SERVICE', title: "Youth Volunteering", year: 2023 }
];

const SEED_LEADERSHIP: LeadershipMember[] = [
  { id: 'l1', name: 'Engineer Brhane B.', roleKey: 'landing.history.chairman', imgUrl: '/images/chairman.png' },
  { id: 'l2', name: 'W/ro Gal Qilet', roleKey: 'landing.history.secretary', imgUrl: '/images/secretary.jpg' },
  { id: 'l3', name: 'Instructor Atsbha T.', roleKey: 'login.treasurer', imgUrl: '/images/treasurer.jpg' },
];

const DEFAULT_PREFS: NotificationPreferences = {
  email: true,
  sms: true,
  types: { meetings: true, payments: true, news: true }
};

const SEED_MEMBERS: Member[] = [
  {
    id: 'm00001',
    fullName: 'Engineer Brhane B.',
    email: 'birieb2013@gmail.com',
    phone: '+251 914 41 15 67',
    role: UserRole.ADMIN,
    status: 'ACTIVE',
    joinDate: getRelativeDate(-180), // ~6 months ago
    balance: 2200,
    avatarUrl: 'https://picsum.photos/100/100?random=1',
    gender: 'MALE',
    password: 'bb@12345',
    notificationPreferences: DEFAULT_PREFS
  },
  {
    id: 'm00002',
    fullName: 'Instructor Atsbha T',
    email: 'atsbhatk@gmail.com',
    phone: '+251 911 22 33 44',
    role: UserRole.TREASURER,
    status: 'ACTIVE',
    joinDate: getRelativeDate(-150),
    balance: 2200,
    avatarUrl: 'https://picsum.photos/100/100?random=3',
    gender: 'MALE',
    password: '123456',
    notificationPreferences: DEFAULT_PREFS
  },
  {
    id: 'm00003',
    fullName: 'W/ro Gal Qilet',
    email: 'aster.secretary@gmail.com',
    phone: '+251 922 44 55 66',
    role: UserRole.SECRETARY,
    status: 'ACTIVE',
    joinDate: getRelativeDate(-120),
    balance: 2200,
    avatarUrl: 'https://picsum.photos/100/100?random=4',
    gender: 'FEMALE',
    password: '123456',
    notificationPreferences: DEFAULT_PREFS
  },
  {
    id: 'm00008',
    fullName: 'Engineer Temesgen G.',
    email: 'tmacbel12@gmail.com',
    phone: '+251 914 82 51 74',
    role: UserRole.MEMBER,
    status: 'ACTIVE',
    joinDate: getRelativeDate(-60), // ~2 months ago
    balance: 2200,
    avatarUrl: 'https://picsum.photos/100/100?random=2',
    gender: 'MALE',
    password: '123456',
    notificationPreferences: DEFAULT_PREFS
  },
];

const SEED_TRANSACTIONS: Transaction[] = [
  { id: 't1', memberId: 'm00001', memberName: 'Engineer Brhane B.', date: getRelativeDate(-30), amount: 100, type: 'CONTRIBUTION', description: 'Monthly Dues', status: TransactionStatus.COMPLETED },
  { id: 't2', memberId: 'm00002', memberName: 'Instructor Atsbha T', date: getRelativeDate(-25), amount: 100, type: 'CONTRIBUTION', description: 'Monthly Dues', status: TransactionStatus.COMPLETED },
  { id: 't3', memberId: 'm00001', memberName: 'Engineer Brhane B.', date: getRelativeDate(-1), amount: 100, type: 'CONTRIBUTION', description: 'Monthly Dues', status: TransactionStatus.COMPLETED },
];

const SEED_CLAIMS: Claim[] = [
  { id: 'c1', memberId: 'm00017', memberName: 'Sara Kebede', type: 'FUNERAL', description: 'Passing of aunt', amountRequested: 5000, status: ClaimStatus.PENDING, dateFiled: getRelativeDate(-3) }
];

// --- Utility: Image Compression ---
export const compressImage = (file: File, maxWidth = 1200, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};

class MockDbService {
  private inMemoryStore: Record<string, any> = {};

  constructor() {
    this.init();
  }

  private init() {
      // Initialize all collections
      this.inMemoryStore['mahber_settings'] = this.load('mahber_settings', SEED_SETTINGS);
      this.inMemoryStore['mahber_gallery'] = this.load('mahber_gallery', SEED_GALLERY);
      this.inMemoryStore['mahber_leadership'] = this.load('mahber_leadership', SEED_LEADERSHIP);
      this.inMemoryStore['mahber_members'] = this.load('mahber_members', SEED_MEMBERS);
      this.inMemoryStore['mahber_transactions'] = this.load('mahber_transactions', SEED_TRANSACTIONS);
      this.inMemoryStore['mahber_claims'] = this.load('mahber_claims', SEED_CLAIMS);
  }

  private load<T>(key: string, seed: T): T {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn(`LocalStorage load failed for ${key}`, error);
    }
    // If not found or error, return seed and save it
    this.persist(key, seed);
    return JSON.parse(JSON.stringify(seed)); // Deep copy seed
  }

  private persist(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`LocalStorage write failed for ${key}`, error);
    }
  }

  private get<T>(key: string): T {
    // Return a copy to avoid mutation of the store by reference
    return JSON.parse(JSON.stringify(this.inMemoryStore[key]));
  }

  private set<T>(key: string, data: T): void {
    this.inMemoryStore[key] = data;
    this.persist(key, data);
  }

  // --- Settings ---
  getSettings(): AppSettings {
      return this.get('mahber_settings');
  }

  updateSettings(settings: Partial<AppSettings>): void {
      const current = this.getSettings();
      this.set('mahber_settings', { ...current, ...settings });
  }

  // --- Gallery ---
  getGallery(): GalleryItem[] {
      return this.get('mahber_gallery');
  }

  addGalleryItem(item: GalleryItem): void {
      const items = this.getGallery();
      items.unshift(item); 
      this.set('mahber_gallery', items);
  }

  deleteGalleryItem(id: string): void {
      let items = this.getGallery();
      items = items.filter(i => i.id !== id);
      this.set('mahber_gallery', items);
  }

  // --- Leadership ---
  getLeadership(): LeadershipMember[] {
      return this.get('mahber_leadership');
  }

  updateLeadershipMember(member: LeadershipMember): void {
      const list = this.getLeadership();
      const index = list.findIndex(l => l.id === member.id);
      if (index !== -1) {
          list[index] = member;
          this.set('mahber_leadership', list);
      }
  }

  // --- Members ---
  getMembers(): Member[] {
    return this.get('mahber_members');
  }

  getMember(id: string): Member | undefined {
    return this.getMembers().find(m => m.id === id);
  }

  addMember(member: Member): void {
    const members = this.getMembers();
    // Ensure notification preferences are set if not provided
    if (!member.notificationPreferences) {
        member.notificationPreferences = DEFAULT_PREFS;
    }
    members.push(member);
    this.set('mahber_members', members);
  }

  updateMember(member: Member): void {
    const members = this.getMembers();
    const index = members.findIndex(m => m.id === member.id);
    if (index !== -1) {
      members[index] = member;
      this.set('mahber_members', members);
    }
  }

  deleteMember(id: string): void {
    let members = this.getMembers();
    members = members.filter(m => m.id !== id);
    this.set('mahber_members', members);
  }

  // New method to approve a member and add initial payment
  approveRegistration(memberId: string): void {
    // Atomic update strategy: Read all, Modify all, Save all
    const members = this.getMembers();
    const transactions = this.getTransactions();

    const memberIndex = members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
        console.error("Member not found for approval");
        return;
    }

    // 1. Update Member Status
    const member = members[memberIndex];
    member.status = 'ACTIVE';
    
    // Safety check for balance
    if (typeof member.balance !== 'number') {
        member.balance = parseFloat(member.balance as any) || 0;
    }

    // 2. Handle Initial Transaction
    const txIndex = transactions.findIndex(t => 
        t.memberId === memberId && 
        (t.description.includes('Initial Registration') || t.description.includes('Initial Payment')) && 
        t.status === TransactionStatus.PENDING
    );

    if (txIndex !== -1) {
        // Complete existing pending transaction
        transactions[txIndex].status = TransactionStatus.COMPLETED;
        // Credit balance
        member.balance += transactions[txIndex].amount;
    } else {
        // Fallback: Create new completion transaction if missing
        member.balance += 2200;
        transactions.push({
            id: `tx${Date.now()}`,
            memberId: memberId,
            memberName: member.fullName,
            date: new Date().toISOString().split('T')[0],
            amount: 2200,
            type: 'CONTRIBUTION',
            description: 'Initial Registration Fee',
            status: TransactionStatus.COMPLETED
        });
    }

    // 3. Save updates
    members[memberIndex] = member; 
    this.set('mahber_members', members);
    this.set('mahber_transactions', transactions);
    console.log(`Member ${memberId} approved. New status: ACTIVE. New balance: ${member.balance}`);
  }

  rejectRegistration(memberId: string): void {
    const members = this.getMembers();
    const transactions = this.getTransactions();

    const memberIndex = members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) return;

    // 1. Update Member Status
    members[memberIndex].status = 'REJECTED';

    // 2. Reject Transaction
    const txIndex = transactions.findIndex(t => 
        t.memberId === memberId && 
        (t.description.includes('Initial Registration') || t.description.includes('Initial Payment')) && 
        t.status === TransactionStatus.PENDING
    );

    if (txIndex !== -1) {
        transactions[txIndex].status = TransactionStatus.REJECTED;
    }

    // 3. Save updates
    this.set('mahber_members', members);
    this.set('mahber_transactions', transactions);
  }

  // --- Transactions ---
  getTransactions(): Transaction[] {
    return this.get('mahber_transactions');
  }

  addTransaction(transaction: Transaction): void {
    const txs = this.getTransactions();
    txs.push(transaction);
    this.set('mahber_transactions', txs);
    
    // If adding a transaction that is already completed, update balance
    if (transaction.status === TransactionStatus.COMPLETED && transaction.memberId !== 'SYSTEM') {
        if (transaction.description !== 'Initial Registration Fee') {
             this.updateMemberBalance(transaction.memberId, transaction.amount, transaction.type, 'ADD');
        }
    }
  }

  updateTransactionStatus(id: string, status: TransactionStatus): void {
      const txs = this.getTransactions();
      const index = txs.findIndex(t => t.id === id);
      
      if (index !== -1) {
          const tx = txs[index];
          const previousStatus = tx.status;
          
          // Update the transaction in the list
          tx.status = status;
          txs[index] = tx;
          this.set('mahber_transactions', txs);

          // Handle Balance Updates logic
          // 1. If moving from PENDING to COMPLETED -> Add to Balance
          if (previousStatus !== TransactionStatus.COMPLETED && status === TransactionStatus.COMPLETED) {
              if (tx.memberId !== 'SYSTEM') {
                  this.updateMemberBalance(tx.memberId, tx.amount, tx.type, 'ADD');
              }
          }
          
          // 2. If moving from COMPLETED to REJECTED/PENDING -> Reverse Balance (not common in this flow but good for safety)
          if (previousStatus === TransactionStatus.COMPLETED && status !== TransactionStatus.COMPLETED) {
               if (tx.memberId !== 'SYSTEM') {
                  this.updateMemberBalance(tx.memberId, tx.amount, tx.type, 'SUBTRACT');
               }
          }
      }
  }

  private updateMemberBalance(memberId: string, amount: number, type: string, operation: 'ADD' | 'SUBTRACT') {
      const members = this.getMembers();
      const index = members.findIndex(m => m.id === memberId);
      
      if (index !== -1) {
          const member = members[index];
          let balanceChange = Number(amount);
          
          // Contribution adds to balance, Penalty subtracts
          if (type === 'PENALTY') {
              balanceChange = -balanceChange;
          }
          
          // If we are reversing the operation (e.g. un-completing)
          if (operation === 'SUBTRACT') {
              balanceChange = -balanceChange;
          }

          member.balance = Number(member.balance) + balanceChange;
          members[index] = member;
          this.set('mahber_members', members);
      }
  }

  // --- Claims ---
  getClaims(): Claim[] {
    return this.get('mahber_claims');
  }

  addClaim(claimData: Omit<Claim, 'id' | 'status' | 'dateFiled'>): void {
    const claims = this.getClaims();
    const newClaim: Claim = {
        id: `c${Date.now()}`,
        status: ClaimStatus.PENDING,
        dateFiled: new Date().toISOString().split('T')[0],
        ...claimData
    };
    claims.push(newClaim);
    this.set('mahber_claims', claims);
  }

  updateClaim(id: string, status: ClaimStatus): void {
    const claims = this.getClaims();
    const claim = claims.find(c => c.id === id);
    if (claim) {
      claim.status = status;
      this.set('mahber_claims', claims);
    }
  }
  
  // --- Financials ---
  getTotalFunds(): number {
    const txs = this.getTransactions();
    return txs
      .filter(t => t.status === TransactionStatus.COMPLETED)
      .reduce((acc, curr) => acc + curr.amount, 10000); 
  }
}

export const mockDb = new MockDbService();