import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'EN' | 'TI';

type Translations = {
  [key: string]: {
    EN: string;
    TI: string;
  };
};

const translations: Translations = {
  // Sidebar
  'app.title': { EN: 'Mahber', TI: 'ማሕበር' },
  'app.subtitle': { EN: 'Iddir St.Merry Qilet', TI: 'እድር ቅድስቲ ማርያም ቅለት' },
  'app.mobile_header': { EN: 'Mahber', TI: 'ማሕበር' },
  'app.mobile_subtitle': { EN: 'Iddir St.Merry Qilet', TI: 'እድር ቅድስቲ ማርያም ቅለት' },
  'nav.home': { EN: 'Home', TI: 'መእተዊ' },
  'nav.about': { EN: 'About Us', TI: 'ብዛዕባና' },
  'nav.gallery': { EN: 'Gallery', TI: 'ፎቶታት' },
  'nav.contact': { EN: 'Contact Us', TI: 'ርኸቡና' },
  'nav.dashboard': { EN: 'Dashboard', TI: 'መጠቃለሊ ገፅ' },
  'nav.members': { EN: 'Member Directory', TI: 'ዝርዝር ኣባላት' },
  'nav.financials': { EN: 'Financial Ledger', TI: 'ፋይናንሳዊ መዝገብ' },
  'nav.notifications': { EN: 'Notifications (AI)', TI: 'መልእኽቲታት (AI)' },
  'nav.portal': { EN: 'My Portal', TI: 'ናይ ውልቀይ ማህደር' },
  'nav.history': { EN: 'Payment History', TI: 'ዝተከፈለ' },
  'nav.logout': { EN: 'Sign Out', TI: 'ውፃእ' },

  // Common
  'common.cancel': { EN: 'Cancel', TI: 'ሰርዝ' },
  'common.submit': { EN: 'Submit', TI: 'ኣረክብ' },
  'common.save': { EN: 'Save Changes', TI: 'ለውጥታት ዓቅብ' },
  'common.edit': { EN: 'Edit', TI: 'ኣመሓይሽ' },
  'common.delete': { EN: 'Delete', TI: 'ሰርዝ' },
  'common.search': { EN: 'Search...', TI: 'ድለ...' },
  'common.filter': { EN: 'Filter', TI: 'ምረፅ' },
  'common.download': { EN: 'Export', TI: 'ኣውርድ' },
  'common.loading': { EN: 'Loading...', TI: 'ይለኣክ ኣሎ...' },
  'common.back': { EN: 'Back', TI: 'ተመለስ' },
  'common.back_home': { EN: 'Back to Home', TI: 'ናብ መእተዊ ተመለስ' },
  'common.full_name': { EN: 'Full Name', TI: 'ምሉእ ሽም' },
  'common.email': { EN: 'Email', TI: 'ኢሜይል' },
  'common.phone': { EN: 'Phone', TI: 'ቁ.ስልኪ' },
  'common.role': { EN: 'Role', TI: 'ግደ' },
  'common.gender': { EN: 'Gender', TI: 'ፆታ' },
  'common.status': { EN: 'Status', TI: 'ኩነታት' },
  'common.password': { EN: 'Password', TI: 'ና ይሕለፍ ቃል' },
  'common.confirm_password': { EN: 'Confirm Password', TI: 'ና ይሕለፍ ቃል ኣረጋግፅ' },
  'common.continue': { EN: 'Continue', TI: 'ቀፅል' },
  'common.male': { EN: 'Male', TI: 'ተባ' },
  'common.female': { EN: 'Female', TI: 'ኣን' },
  'common.actions': { EN: 'Actions', TI: 'ስጉምቲ' },
  'common.date': { EN: 'Date', TI: 'ዕለት' },
  'common.amount': { EN: 'Amount', TI: 'መጠን' },
  'common.description': { EN: 'Description', TI: 'መብርሂ' },
  'common.type': { EN: 'Type', TI: 'ዓይነት' },
  'common.system': { EN: 'System', TI: 'ሲስተም' },

  // Landing & Public Pages
  'landing.est': { EN: 'Est. 2024 • Mekelle', TI: 'ተመስሪቱ 2016 • መቐለ' },
  'landing.hero.title': { EN: 'Community Strength Through Unity', TI: 'ንሓድነት ማሕበረሰብና' },
  'landing.hero.subtitle': { EN: 'Welcome to the Mahber Iddir St.Merry Qilet official portal. We provide mutual aid, funeral insurance, and community support.', TI: 'እንኳዕ ናብ ማሕበር እድር ቅድስቲ ማርያም ቅለት ብደሓን መፃእኩም። ናይ ምትሕግጋዝ፣ ሓዘንን ማሕበራዊ ድጋፍን ንህብ ኢና።' },
  'landing.btn.login': { EN: 'Member Login', TI: 'ኣባል ተኮይኖም/ነን ይእተዪ/ያ' },
  'landing.btn.join': { EN: 'Join the Community', TI: 'ኣባል ንኩን' },
  'landing.history.title': { EN: 'Preserving Tradition in the Digital Age', TI: 'ባህሊ ኣብ ዘመነ ዲጂታል ምዕቃብ' },
  'landing.history.desc': { EN: 'Founded in 2024 by elders in the Mekelle, our Iddir started with just 12 families. Today, we serve over 300 households. This platform bridges our rich traditions with modern efficiency, ensuring that our children can continue the legacy of mutual aid.', TI: 'ብ 2016 ብደቂ ቅለት ኣብ ከተማ መቐለ ዝተመስረተ እድርና፣ ብ 20 ስድራቤታት ጀሚሩ ሎሚ ልዕሊ 200 ስድራቤታት የገልግል ኣሎ። እዚ ፕላትፎርም ንባህላዊ ክብርታትና ምስ ዘመናዊ ቴክኖሎጂ ብምውህሃድ፣ ደቅና ባህሊ ምትሕግጋዝ ክወርሱ የኽእሎም።' },
  'landing.history.chairman': { EN: 'Chairman', TI: 'ኣቦ ወንበር' },
  'landing.history.secretary': { EN: 'Secretary', TI: 'ፀሓፊ' },
  'landing.smart_image': { EN: 'Smart Image', TI: 'ስእሊ ብ AI' },
  'landing.generating': { EN: 'Designing with Gemini...', TI: 'ብ Gemini ይስራሕ ኣሎ...' },
  'landing.footer.rights': { EN: 'All rights reserved.', TI: 'መሰሉ ብሕጊ ዝተሓለወ እዩ።' },
  'landing.footer.privacy': { EN: 'Privacy', TI: 'ውልቃዊ ሓበሬታ' },
  'landing.footer.contact': { EN: 'Adress', TI: 'ኣድራሻና' },
  'landing.footer.bylaws': { EN: 'Bylaws', TI: 'ውሽጣዊ ሕጊ' },

  // About Us
  'about.mission': { EN: 'Our Mission', TI: 'ተልእኾና' },
  'about.mission.desc': { EN: 'To provide timely social and financial support to members during times of joy and sorrow.', TI: 'ኣብ ግዜ ሓጎስን ሓዘንን ንኣባላትና ቅልጡፍ ማሕበራዊን ፋይናንሳዊን ደገፍ ምሃብ።' },
  'about.vision': { EN: 'Our Vision', TI: 'ራእይና' },
  'about.vision.desc': { EN: 'To be a model of modern, transparent, and compassionate community association in Ethiopia.', TI: 'ኣብ ኢትዮጵያ ንዘመናዊ፣ ግልፅን ርህሩህን ማሕበረሰብ ኣብነት ምዃን።' },
  'about.values': { EN: 'Core Values', TI: 'ክብርታትና' },
  'about.leadership': { EN: 'Leadership Team', TI: 'መራሕቲ' },

  // Core Values
  'value.solidarity': { EN: 'Solidarity', TI: 'ሓድነት' },
  'value.solidarity.desc': { EN: 'We stand together as one family, supporting each other in times of joy and sorrow.', TI: 'ከም ሓደ ስድራ ብሓባር ደው ንብል፣ ብሓጎስን ሓዘንን ንተሓጋገዝ።' },
  'value.integrity': { EN: 'Integrity', TI: 'ተኣማኒነት' },
  'value.integrity.desc': { EN: 'We uphold the highest standards of honesty and ethics in managing community resources.', TI: 'ሃፍቲ ማሕበረሰብና ብልዑል ቅንዕናን ስነ-ምግባርን ንምህዳር ንሰርሕ።' },
  'value.transparency': { EN: 'Transparency', TI: 'ግልፅነት' },
  'value.transparency.desc': { EN: 'Every contribution and expense is recorded and open for members to review at any time.', TI: 'ኩሉ ውፅኢትን ኣታዊን ተመዝጊቡ ንኣባላት ብግልፅ ይቐርብ።' },
  'value.compassion': { EN: 'Compassion', TI: 'ርህራሄ' },
  'value.compassion.desc': { EN: 'We serve our members with empathy, providing a safety net during emergencies and loss.', TI: 'ንኣባላትና ብድንጋፅ ነገልግል፣ ኣብ ግዜ ፀገምን ሓዘንን ድማ ደገፍ ንህብ።' },
  'value.accountability': { EN: 'Accountability', TI: 'ተሓታትነት' },
  'value.accountability.desc': { EN: 'We are responsible to our members for every decision made and every cent collected.', TI: 'ንዝወሳን ውሳነን ዝእከብ ገንዘብን ተሓተትቲ ኢና።' },
  'value.equality': { EN: 'Equality', TI: 'ማዕርነት' },
  'value.equality.desc': { EN: 'Every member has an equal voice and equal access to the benefits of the Iddir.', TI: 'ኩሉ ኣባል ማዕረ ድምፅን ተጠቃምነትን ኣለዎ።' },

  // Contact Us
  'contact.get_in_touch': { EN: 'Get In Touch', TI: 'ርኸቡና' },
  'contact.subtitle': { EN: 'Have questions? We are here to help.', TI: 'ሕቶ ኣለኩም? ንምሕጋዝ ድሉዋት ኢና።' },
  'contact.address': { EN: 'Address', TI: 'ኣድራሻ' },
  'contact.address.val': { EN: 'Mekelle, Tigray, Ethiopia', TI: 'መቐለ፣ ትግራይ' },
  'contact.form.name': { EN: 'Your Name', TI: 'ሽምኩም' },
  'contact.form.message': { EN: 'Message', TI: 'መልእኽቲ' },
  'contact.form.send': { EN: 'Send Message', TI: 'መልእኽቲ ስደድ' },

  // Gallery
  'gallery.title': { EN: 'Community Gallery', TI: 'ምስልታት ማሕበረሰብ' },
  'gallery.subtitle': { EN: 'Moments from our gatherings, feasts, and community service.', TI: 'ካብ ኣኼባታት፣ በዓላትን ማሕበራዊ ኣገልግሎትን ዝተወስዱ ምስልታት።' },
  'gallery.ai_feature': { EN: 'AI Generated Concept Art', TI: 'ብ AI ዝተሰርሑ ስእልታት' },
  'gallery.cat.all': { EN: 'All Photos', TI: 'ኩሉ' },
  'gallery.cat.meetings': { EN: 'Meetings', TI: 'ኣኼባታት' },
  'gallery.cat.feasts': { EN: 'Feasts & Celebrations', TI: 'በዓላት' },
  'gallery.cat.service': { EN: 'Community Service', TI: 'ማሕበራዊ ኣገልግሎት' },
  'gallery.filter.year': { EN: 'Year', TI: 'ዓመተ ምህረት' },
  'gallery.filter.all_years': { EN: 'All Years', TI: 'ኩሉ ዓመታት' },
  
  // Login
  'login.title': { EN: 'Member Login', TI: 'ናይ ኣባላት መእተዊ' },
  'login.subtitle': { EN: 'Select a role to simulate login', TI: 'ሓላፍነት መሪፅካ እቶ' },
  'login.admin': { EN: 'Log in as Chairman (Admin)', TI: 'ከም ኣቦ ወንበር እቶ' },
  'login.treasurer': { EN: 'Treasurer', TI: 'ተሓዚ ገንዘብ' },
  'login.secretary': { EN: 'Secretary', TI: 'ፀሓፊ' },
  'login.member': { EN: 'Log in as Member', TI: 'ከም ኣባል እቶ' },
  'login.new_user': { EN: 'New to the Iddir?', TI: 'ሓዱሽ ኣባል?' },
  'login.register': { EN: 'Register as a new Member', TI: 'ተመዝገብ' },

  // Register
  'register.title': { EN: 'Join Mahber Iddir', TI: 'ናብ ማሕበር እድርና ተወሰኽ' },
  'register.subtitle': { EN: 'Become a member of our community support network', TI: 'ኣባል ናይዚ ማሕበረሰብ ሓገዝ ኩን' },
  'register.verify_title': { EN: 'Verify Account', TI: 'ኣካውንት ኣረጋግፅ' },
  'register.verify_subtitle': { EN: 'We sent a verification code to your email/phone', TI: 'ናብ ኢሜይልካ/ስልክኻ ኮድ ሊኢኽና ኣለና' },
  'register.code_sent': { EN: 'Code sent to', TI: 'ኮድ ዝተላኣከሉ' },
  'register.demo_otp': { EN: 'Demo OTP', TI: 'መፈተኒ ኮድ' },
  'register.verification_code': { EN: 'Verification Code', TI: 'መረጋገፂ ኮድ' },
  'register.enter_code': { EN: 'Enter 6-digit code', TI: '6 ኣላማ ኮድ የእቱ' },
  'register.verify_btn': { EN: 'Verify', TI: 'ኣረጋግፅ' },
  'register.resend': { EN: 'Resend Code', TI: 'ኮድ እንደገና ስደድ' },
  'register.change_info': { EN: 'Change Info', TI: 'ሓበሬታ ቐይር' },
  'register.already_member': { EN: 'Already have an account?', TI: 'ድሮ ኣባል ኢኻ?' },
  'register.signin': { EN: 'Sign in here', TI: 'ኣብዚ እቶ' },
  'register.payment_title': { EN: 'Initial Payment', TI: 'መእተዊ ክፍሊት' },
  'register.payment_desc': { EN: 'To activate your membership, a fee of 2,200 ETB is required.', TI: 'ን ኣባልነት ንም activación 2,200 ብር ክፍሊት የድሊ።' },
  'register.upload_receipt': { EN: 'Upload Bank Receipt', TI: 'ናይ ባንኪ ቅብሊት ኣብዚ የእትዉ' },
  'register.complete': { EN: 'Complete Registration', TI: 'ምዝገባ ዛዝም' },

  // Features
  'feature.security': { EN: 'Financial Security', TI: 'ፋይናንሳዊ ውሕስነት' },
  'feature.security.desc': { EN: 'Secure tracking of monthly contributions.', TI: 'ወርሓዊ ክፍሊት ብዘተኣማምን መንገዲ ምሓዝ።' },
  'feature.support': { EN: 'Mutual Support', TI: 'ማሕበራዊ ሓገዝ' },
  'feature.support.desc': { EN: 'Immediate assistance during Haapiness, funerals and emergencies.', TI: 'ኣብ ግዜ ሓጎስ፣ ሓዘንን ፀገምን ቅልጡፍ ሓገዝ።' },
  'feature.community': { EN: 'Active Community', TI: 'ንቁሕ ማሕበረሰብ' },
  'feature.community.desc': { EN: 'Regular meetings and annual feasts.', TI: 'ስሩዕ ኣኼባታትን ዓመታዊ በዓላትን።' },

  // Member Portal
  'portal.greeting': { EN: 'Dear', TI: 'ክቡር/ቲ' },
  'portal.greeting.MALE': { EN: 'Dear', TI: 'ክቡር ' },
  'portal.greeting.FEMALE': { EN: 'Dear', TI: 'ክብርቲ' },
  'portal.welcome': { EN: 'Welcome to Mahber Iddir St.Merry Qilet', TI: 'እንኳዕ ናብ ማሕበር እድር ቅድስቲ ማርያም ቅለት ብደሓን መፁ።' },
  'portal.id': { EN: 'Member ID', TI: 'መለለዪ ቁፅሪ' },
  'portal.status': { EN: 'Status', TI: 'ኩነታት' },
  'portal.joined': { EN: 'Joined', TI: 'ዝኣተወሉ' },
  'portal.balance': { EN: 'Current Balance', TI: 'ዘሎ ሒሳብ' },
  'portal.btn.pay': { EN: 'Make Payment', TI: 'ክፍሊት ፈፅም' },
  'portal.btn.support': { EN: 'Request Support', TI: 'ሓገዝ ሕተት' },
  'portal.recent_contrib': { EN: 'Recent Contribution History', TI: 'ናይ ቀረባ ግዜ ክፍሊት' },
  'portal.monthly_contrib': { EN: 'Monthly Contribution', TI: 'ወርሓዊ ክፍሊት' },
  'portal.view_history': { EN: 'View Full History', TI: 'ዝርዝር ክፍሊት ርአ' },
  'portal.upcoming': { EN: 'Upcoming Events', TI: 'ዝመፁ መደባት' },
  'portal.event.assembly': { EN: 'General Assembly Meeting', TI: 'ጠቕላላ ጉባኤ ኣኼባ' },
  'portal.event.assembly_desc': { EN: 'Discussion on annual budget.', TI: 'ዘተ ኣብ ዓመታዊ በጀት።' },
  'portal.event.feast': { EN: 'Annual Community Feast', TI: 'ዓመታዊ በዓል ንግደት' },
  'portal.event.feast_desc': { EN: 'Gathering at the community hall.', TI: 'ብሓባር ምብዓል።' },
  
  // Admin Dashboard
  'dashboard.overview': { EN: 'Overview of association status and activities.', TI: 'ሓፈሻዊ ኩነታትን ንጥፈታትን ማሕበርና።' },
  'dashboard.date': { EN: 'Date', TI: 'ዕለት' },
  'dashboard.stat.members': { EN: 'Total Members', TI: 'በዝሒ ኣባላት' },
  'dashboard.stat.funds': { EN: 'Total Funds', TI: 'ጠቕላላ ርእሰማል' },
  'dashboard.stat.pending': { EN: 'Pending Claims', TI: 'ዝተሓተቱ ሓገዛት' },
  'dashboard.stat.pending_regs': { EN: 'New Registrations', TI: 'ሓደሽቲ ዝተመዝገቡ' },
  'dashboard.stat.action_required': { EN: 'Action Required', TI: 'ትግበራ ይፅበ' },
  'dashboard.stat.all_clear': { EN: 'All Clear', TI: 'ኩሉ ፅቡቕ' },
  'dashboard.stat.vs_last': { EN: 'vs last month', TI: 'ምስ ዝሓለፈ ወርሒ' },
  'dashboard.claims.title': { EN: 'Benefit Requests', TI: 'ጠለብ ሓገዛት' },
  'dashboard.registrations.title': { EN: 'Pending Member Registrations', TI: 'ምፅዳቕ ዝፅበዩ ሓደሽቲ ኣባላት' },
  'dashboard.registrations.empty': { EN: 'No pending registrations.', TI: 'ሓዱሽ ዝተመዝገበ የለን።' },
  'dashboard.registrations.approve_btn': { EN: 'Approve & Pay 2200', TI: 'ኣፅድቕ (2200 ክፈል)' },
  'dashboard.registrations.reject_btn': { EN: 'Reject', TI: 'ንፀግ' },
  'dashboard.registrations.confirm_reject': { EN: 'Are you sure you want to reject this registration?', TI: 'ነዚ ምዝገባ ክትነፅጎ ርግፀኛ ዲኻ?' },
  'dashboard.table.member': { EN: 'Member', TI: 'ኣባል' },
  'dashboard.table.type': { EN: 'Type', TI: 'ዓይነት' },
  'dashboard.table.desc': { EN: 'Description', TI: 'መብርሂ' },
  'dashboard.table.amount': { EN: 'Amount', TI: 'መጠን' },
  'dashboard.table.status': { EN: 'Status', TI: 'ኩነታት' },
  'dashboard.table.actions': { EN: 'Actions', TI: 'ስጉምቲ' },
  'dashboard.table.date': { EN: 'Date', TI: 'ዕለት' },
  'dashboard.claims.empty': { EN: 'No active claims found.', TI: 'ዝኾነ ሓገዝ ኣይተሓተተን።' },
  'dashboard.manage.title': { EN: 'Manage Membership', TI: 'ምምሕዳር ኣባላት' },
  'dashboard.manage.desc': { EN: 'Update member statuses or add new registrations.', TI: 'ኩነታት ኣባላት ኣፃሪ ወይ ሓዱሽ ኣባል መዝግብ።' },
  'dashboard.manage.btn': { EN: 'Go to Directory', TI: 'ናብ ዝርዝር ኣባላት ኪድ' },

  // Member Directory
  'directory.title': { EN: 'Member Directory', TI: 'ዝርዝር ኣባላት' },
  'directory.subtitle': { EN: 'Manage association members and their status.', TI: 'ኩነታት ኣባላት ማሕበር የመሓድሩ።' },
  'directory.search_placeholder': { EN: 'Search members...', TI: 'ኣባላት ድለይ...' },
  'directory.add_btn': { EN: 'Add Member', TI: 'ኣባል ወስኽ' },
  'directory.no_members': { EN: 'No members found matching', TI: 'ዝተረኽበ ኣባል የለን ብ' },
  'directory.role.admin': { EN: 'Admin', TI: 'ኣመሓዳሪ' },
  'directory.role.treasurer': { EN: 'Treasurer', TI: 'ተሓዝ ገንዘብ' },
  'directory.role.secretary': { EN: 'Secretary', TI: 'ፀሓፊ' },
  'directory.role.community_service': { EN: 'Community Service', TI: 'ማሕበራዊ ኣገልግሎት' },
  'directory.role.member': { EN: 'Member', TI: 'ኣባል' },

  // Financial Ledger
  'financials.title': { EN: 'Financial Ledger', TI: 'ፋይናንሳዊ መዝገብ' },
  'financials.export': { EN: 'Print Report', TI: 'ሪፖርት ኣውርድ' },
  'financials.chart_title': { EN: 'Income vs Expenses (Last 5 Months)', TI: 'ኣታውን ወፃኢን (ዝሓለፉ 5 ኣዋርሕ)' },
  'financials.pie_title': { EN: 'Revenue Sources', TI: 'ምንጪ ኣታዊ' },
  'financials.recent_tx': { EN: 'Recent Transactions', TI: 'ናይ ቀረባ ግዜ ምንቅስቓስ' },
  'financials.source.contributions': { EN: 'Contributions', TI: 'ክፍሊት' },
  'financials.source.penalties': { EN: 'Penalties', TI: 'መቕፃዕቲ' },
  'financials.source.donations': { EN: 'Donations', TI: 'ወፈያ' },
  'ledger.tab.overview': { EN: 'Overview', TI: 'ጠቕላላ' },
  'ledger.tab.pending': { EN: 'Pending Approvals', TI: 'ምፅዳቕ ዝፅበ' },
  'ledger.pending_title': { EN: 'Pending Transactions', TI: 'ምፅዳቕ ዝፅበዩ ክፍሊታት' },
  'ledger.pending_desc': { EN: 'Review and approve member payments here.', TI: 'ናይ ኣባላት ክፍሊት መርሚርካ ኣፅድቕ።' },
  'ledger.no_pending': { EN: 'No pending transactions to approve.', TI: 'ምፅዳቕ ዝፅበ ክፍሊት የለን።' },
  'ledger.receipt': { EN: 'Receipt', TI: 'ቅብሊት' },
  'ledger.view_receipt': { EN: 'View Receipt', TI: 'ቅብሊት ርአ' },
  'ledger.approve': { EN: 'Approve Payment', TI: 'ክፍሊት ኣፅድቕ' },
  'ledger.reject': { EN: 'Reject Payment', TI: 'ክፍሊት ንፀግ' },
  'ledger.confirm_approve': { EN: 'Are you sure you want to approve this payment?', TI: 'ነዚ ክፍሊት ከተፅድቖ ርግፀኛ ዲኻ?' },
  'ledger.confirm_reject': { EN: 'Are you sure you want to reject this payment?', TI: 'ነዚ ክፍሊት ክትነፅጎ ርግፀኛ ዲኻ?' },

  // Payment History
  'history.subtitle': { EN: 'View your contributions, penalties, and benefit payouts.', TI: 'ክፍሊት፣ መቕፃዕቲን ዝተረከብካዮ ሓገዝን ተኸታተል።' },
  'history.search_placeholder': { EN: 'Search...', TI: 'ድለ...' },
  'history.filter.all': { EN: 'All Types', TI: 'ኩሉ ዓይነት' },
  'history.filter.contribution': { EN: 'Contributions', TI: 'ክፍሊት' },
  'history.filter.penalty': { EN: 'Penalties', TI: 'መቕፃዕቲ' },
  'history.filter.payout': { EN: 'Benefit Payouts', TI: 'ዝተረከብካዮ ሓገዝ' },
  'history.start_date': { EN: 'Start Date', TI: 'መጀመሪ ዕለት' },
  'history.end_date': { EN: 'End Date', TI: 'መወዳእታ ዕለት' },
  'history.export': { EN: 'Print Statement', TI: 'ቅብሊት ሕተም' },
  'history.no_tx': { EN: 'No transactions found matching your criteria.', TI: 'ዝተረኽበ መረዳእታ የለን።' },
  'history.showing': { EN: 'Showing', TI: 'ዝርአ ዘሎ' },
  'history.records': { EN: 'records', TI: 'መዝገብ' },
  'history.payout_badge': { EN: 'PAYOUT', TI: 'ክፍሊት' },

  // Claims
  'claims.modal_title': { EN: 'Request Support Benefit', TI: 'ሓገዝ ሕተት' },
  'claims.info': { EN: 'Submit a claim for Iddir benefits. This request will be reviewed by the committee and funds released upon approval.', TI: 'ናይ እድር ሓገዝ ንምርካብ ፎርም ምላእ። እዚ ሕቶ ብኮሚቴ ተራእዩ ምስ ፀደቐ ገንዘብ ይለቀቕ።' },
  'claims.label_type': { EN: 'Claim Type', TI: 'ዓይነት ሓገዝ' },
  'claims.label_amount': { EN: 'Amount Requested (ETB)', TI: 'ዝሕተት ገንዘብ (ETB)' },
  'claims.label_reason': { EN: 'Reason / Details', TI: 'ምኽንያት / ዝርዝር' },
  'claims.placeholder_desc': { EN: 'Please describe the situation...', TI: 'በይዘኦም እቲ ኩነታት ይግለፁ...' },
  'claims.btn_cancel': { EN: 'Cancel', TI: 'ሰርዝ' },
  'claims.btn_submit': { EN: 'Submit Request', TI: 'ሕቶ ኣቕርብ' },
  'claims.btn_submitting': { EN: 'Submitting...', TI: 'ይልኣኽ ኣሎ...' },
  'claims.type.funeral': { EN: 'Funeral Support', TI: 'ናይ ሓዘን ሓገዝ' },
  'claims.type.medical': { EN: 'Medical Emergency', TI: 'ሕክምናዊ ሓገዝ' },
  'claims.type.wedding': { EN: 'Wedding Gift', TI: 'ናይ መርዓ ህውሃት' },
  'claims.type.other': { EN: 'Other Assistance', TI: 'ካልእ ሓገዝ' },

  // Payment Submission
  'payment.modal_title': { EN: 'Make Payment', TI: 'ክፍሊት ፈፅም' },
  'payment.info': { EN: 'Upload your bank transfer receipt or proof of payment. The treasurer will review and approve your payment.', TI: 'ናይ ባንኪ ቅብሊት ኣብዚ ይልኣኹ። ተሓዚ ገንዘብ መርሚሩ ከፅድቖ እዩ።' },
  'payment.desc_placeholder': { EN: 'e.g. Monthly Contribution for August', TI: 'ምሳሌ፡ ናይ ነሓሰ ወርሓዊ ክፍሊት' },
  'payment.upload_receipt': { EN: 'Upload Receipt / Proof', TI: 'ናይ ክፍሊት መረዳእታ' },

  // Modals
  'modal.add_title': { EN: 'Add New Member', TI: 'ሓዱሽ ኣባል ወስኽ' },
  'modal.edit_title': { EN: 'Edit Member', TI: 'ኣባል ኣመሓይሽ' },
  'modal.create_btn': { EN: 'Create Member', TI: 'ኣባል ፍጠር' },
  'modal.save_btn': { EN: 'Save Changes', TI: 'ለውጥታት ዓቅብ' },
  'modal.initial_status': { EN: 'Initial Status', TI: 'መጀመርያ ኩነታት' },
  'modal.change_photo': { EN: 'Change Photo', TI: 'ስእሊ ቐይር' },
  'modal.photo_hint': { EN: 'Recommended: Square JPG/PNG, max 2MB', TI: 'ዝምረፅ: 4 ኩርናዕ JPG/PNG፣ ክሳብ 2MB' },
  
  // Preferences
  'prefs.title': { EN: 'Notification Preferences', TI: 'ምርጫታት ምልክታ' },
  'prefs.channels': { EN: 'Alert Channels', TI: 'መተሓላለፊ መልእኽቲ' },
  'prefs.email': { EN: 'Email Alerts', TI: 'ኢሜይል ምልክታ' },
  'prefs.sms': { EN: 'SMS Alerts', TI: 'ኤስ.ኤም.ኤስ ምልክታ' },
  'prefs.types': { EN: 'Event Types', TI: 'ዓይነት ፍፃመታት' },
  'prefs.meetings': { EN: 'Meeting Reminders', TI: 'መዘኻኸሪ ኣኼባ' },
  'prefs.payments': { EN: 'Payment Due Alerts', TI: 'ክፍሊት መዘኻኸሪ' },
  'prefs.news': { EN: 'Community News', TI: 'ማሕበራዊ ዜና' },

  // Statuses
  'status.PENDING': { EN: 'PENDING', TI: 'ይፅበ' },
  'status.APPROVED': { EN: 'APPROVED', TI: 'ፀዲቑ' },
  'status.REJECTED': { EN: 'REJECTED', TI: 'ተነፂጉ' },
  'status.ACTIVE': { EN: 'Active', TI: 'ንቁሕ' },
  'status.INACTIVE': { EN: 'Inactive', TI: 'ዘይንቁሕ' },
  
  // Notification AI
  'ai.title': { EN: 'AI Notification Assistant', TI: 'AI ሓጋዚ መልእኽቲ' },
  'ai.subtitle': { EN: 'Draft formal notices automatically using Gemini AI in Tigrigna.', TI: 'ወግዓዊ ምልክታታት ብ Gemini AI ብትግርኛ ኣዳልዉ።' },
  'ai.topic': { EN: 'Notification Topic', TI: 'ርእስ ጉዳይ' },
  'ai.audience': { EN: 'Audience', TI: 'ተቀበልቲ' },
  'ai.tone': { EN: 'Tone', TI: 'ኣቀራርባ' },
  'ai.btn.generate': { EN: 'Generate Draft', TI: 'ምልክታ ኣዳልው' },
  'ai.preview': { EN: 'Preview', TI: 'ቅድም ርአ' },
  'ai.copy': { EN: 'Copy', TI: 'ቅዳሕ' },
  'ai.send_blast': { EN: 'Send Blast', TI: 'ስደድ' },
  'ai.placeholder': { EN: 'Your generated message will appear here...', TI: 'ዝተዳለወ መልእኽቲ ኣብዚ ክረአ እዩ...' },
  'ai.option.all': { EN: 'All Members', TI: 'ኩሎም ኣባላት' },
  'ai.option.defaulters': { EN: 'Defaulters', TI: 'ዘይከፈሉ' },
  'ai.option.committee': { EN: 'Committee', TI: 'ኮሚቴ' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('TI');

  const t = (key: string) => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};