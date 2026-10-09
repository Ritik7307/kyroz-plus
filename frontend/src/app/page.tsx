import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '@/lib/api';

async function getPricingConfig() {
  const defaultPricing = {
    starter: { price: 999, discount: 0 },
    growth: { price: 2999, discount: 0 },
    scale: { price: 9999, discount: 0 }
  };

  try {
    // Cache the pricing config for 1 hour to prevent blocking the landing page render
    const res = await fetch(`${API_URL}/api/admin/settings/pricing`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      return {
        starter: data?.starter || defaultPricing.starter,
        growth: data?.growth || defaultPricing.growth,
        scale: data?.scale || defaultPricing.scale
      };
    }
  } catch (err) {
    console.error('Failed to fetch pricing config:', err);
  }
  return defaultPricing;
}

export default async function Home() {
  const pricing = await getPricingConfig();

  const getFinalPrice = (plan: any) => {
    if (!plan) return 0;
    if (plan.finalPrice !== undefined) return plan.finalPrice;
    return Math.round((plan.price || 0) * (1 - (plan.discount || 0) / 100));
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#d4af37] selection:text-black">
      {/* 1. Header */}
      <nav className="flex items-center justify-between px-4 md:px-12 py-6 border-b border-[#222]">
        <div className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-extrabold tracking-tighter text-[#d4af37] whitespace-nowrap">KYROZ+</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          <Link href="#how-it-works" className="hover:text-[#d4af37] transition">How it works</Link>
          <Link href="#features" className="hover:text-[#d4af37] transition">Solution</Link>
          <Link href="#pricing" className="hover:text-[#d4af37] transition">Pricing</Link>
        </div>
        <div className="flex gap-2 md:gap-4 items-center">
          <Link href="/login" className="px-3 md:px-5 py-2 text-sm font-medium hover:text-[#d4af37] transition whitespace-nowrap">Log in</Link>
          <Link href="/signup" className="px-4 md:px-5 py-2 text-sm font-medium bg-[#d4af37] text-black rounded-full hover:bg-[#c5a028] transition shadow-[0_0_15px_rgba(212,175,55,0.3)] whitespace-nowrap">Get Started</Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-16 md:pt-48 pb-12 md:pb-24 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold tracking-wide uppercase">
            KYROZ+: YOUR GROWTH PARTNER IN RESTAURANT EXCELLENCE
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Staff on leave? <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]">Your kitchen shouldn't stop.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            KYROZ+ standardizes your base gravy, recipes and SOPs so a trained fresher can run your kitchen. No head chef needed. Your own brand. Your signature taste. No franchise fee. No royalty.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#333] text-white font-bold rounded-full hover:bg-[#111] transition text-lg whitespace-nowrap">
              See How It Works
            </Link>
          </div>
          {/* 3. Proof strip */}
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Built inside a real restaurant. At Hungry Mak's, freshers trained for one week now handle the kitchen, and the owner stays free-minded.
          </p>
        </div>
      </section>

      {/* 4. Problem Section */}
      <section className="py-20 bg-[#0a0a0a] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Running a restaurant is chaos.</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">You shouldn't be held hostage by your head chef or lose margins to uncontrolled wastage.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 border border-[#222] bg-[#111] rounded-2xl">
              <div className="text-[#d4af37] text-4xl mb-4">👨‍🍳</div>
              <h3 className="text-xl font-bold mb-3 uppercase">CHEF DEPENDENCY</h3>
              <p className="text-gray-400">Recipes change when the chef changes. Consistency is impossible without strict, documented standards.</p>
            </div>
            <div className="p-8 border border-[#222] bg-[#111] rounded-2xl">
              <div className="text-[#d4af37] text-4xl mb-4">📉</div>
              <h3 className="text-xl font-bold mb-3 uppercase">HIDDEN FOOD COSTS</h3>
              <p className="text-gray-400">Unmeasured wastage and inaccurate costing hurt your profit margins every single day.</p>
            </div>
            <div className="p-8 border border-[#222] bg-[#111] rounded-2xl">
              <div className="text-[#d4af37] text-4xl mb-4">🚪</div>
              <h3 className="text-xl font-bold mb-3 uppercase">SUDDEN STAFF LEAVE</h3>
              <p className="text-gray-400">When several staff go on leave at once, the kitchen stops. Your business shouldn't depend on any one person.</p>
            </div>
            <div className="p-8 border border-[#222] bg-[#111] rounded-2xl">
              <div className="text-[#d4af37] text-4xl mb-4">💸</div>
              <h3 className="text-xl font-bold mb-3 uppercase">NO ROYALTY</h3>
              <p className="text-gray-400">Keep 100% of your profits. Stop giving away your hard-earned margins every month to franchisors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How it works */}
      <section id="how-it-works" className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 flex flex-col md:block">
            <span>One system.</span>
            <span>Four simple steps.</span>
          </h2>

          <div className="space-y-8 text-left">
            <div className="bg-[#111] border border-[#222] p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-12 h-12 rounded-full bg-[#d4af37] text-black font-bold text-xl flex items-center justify-center shrink-0">1</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Morning:</h3>
                <p className="text-gray-400">A kitchen helper prepares KYROZ+ Base in small batches from the standard formula.</p>
              </div>
            </div>

            <div className="bg-[#111] border border-[#222] p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-12 h-12 rounded-full bg-[#d4af37] text-black font-bold text-xl flex items-center justify-center shrink-0">2</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Service:</h3>
                <p className="text-gray-400">Your staff finish each dish with your own signature taste, written in your recipe.</p>
              </div>
            </div>

            <div className="bg-[#111] border border-[#222] p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-12 h-12 rounded-full bg-[#d4af37] text-black font-bold text-xl flex items-center justify-center shrink-0">3</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Control:</h3>
                <p className="text-gray-400">Software tracks costing, wastage, inventory and billing.</p>
              </div>
            </div>

            <div className="bg-[#111] border border-[#222] p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-12 h-12 rounded-full bg-[#d4af37] text-black font-bold text-xl flex items-center justify-center shrink-0">4</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">New staff?</h3>
                <p className="text-gray-400">The SOP library and KYROZ KOSA help you train them quickly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Founder box */}
      <section className="py-20 bg-[#0a0a0a] px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#1a1505] to-[#111] border border-[#d4af37]/30 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(212,175,55,0.05)]">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center md:text-left">A note from the founder</h2>

          <div className="flex flex-col md:flex-row gap-8 items-start mb-10 border-b border-white/10 pb-10">
            <div className="w-32 h-40 md:w-48 md:h-60 rounded-2xl bg-[#222] shrink-0 border border-[#333] flex items-center justify-center mx-auto md:mx-0 overflow-hidden relative">
              <Image src="/founder.jpg" alt="Mohd Arif Kamal - Founder" fill className="object-cover object-top" />
            </div>
            <div>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>I run a spice manufacturing company, Aroma Agro International, and a restaurant, Hungry Mak's. In my own kitchen I faced what every owner faces: dependence on chefs, changing taste, cost leakage, and the stress when several staff suddenly take leave.</p>
                <p>So I built a system: a standard base formula, recipes with SOPs, and software. At Hungry Mak's, freshers trained for one week now handle the kitchen, and I don't worry about who is on leave.</p>
                <p>KYROZ+ is that system, made for your restaurant. Your brand stays yours. No franchise fee. No royalty. We charge only for the product and the software, and we help you with training and kitchen setup.</p>
              </div>
              <div className="mt-6 text-[#d4af37] font-bold">
                Mohd Arif Kamal
                <span className="block text-sm text-gray-500 font-normal">Founder, KYROZ+</span>
                <a href="https://wa.me/918874581717?text=Hi%20Sir%2C%20I%20read%20your%20note%20on%20the%20KYROZ%2B%20website%20and%20would%20like%20to%20talk%20to%20you%20directly%20about%20my%20restaurant." target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-full hover:bg-[#25D366]/20 transition text-sm font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="text-[#d4af37] font-bold uppercase tracking-wider text-sm mb-3">Vision</h3>
              <p className="text-gray-400 italic text-sm">"Every restaurant runs on systems, not on individuals. Great food and consistent quality should never depend on one chef or one employee."</p>
            </div>
            <div>
              <h3 className="text-[#d4af37] font-bold uppercase tracking-wider text-sm mb-3">Mission</h3>
              <p className="text-gray-400 italic text-sm">"To give restaurant owners a practical kitchen system, made of standard base formulas, SOPs and software, so they can control costs, train new staff quickly and grow under their own brand and signature taste."</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm font-medium">
            <span className="px-4 py-2 bg-black/50 border border-[#333] rounded-full text-gray-300">• Your brand stays yours.</span>
            <span className="px-4 py-2 bg-black/50 border border-[#333] rounded-full text-gray-300">• No franchise fee. No royalty.</span>
            <span className="px-4 py-2 bg-black/50 border border-[#333] rounded-full text-gray-300">• Built and tested in a real kitchen.</span>
          </div>
        </div>
      </section>

      {/* 7. Meet KYROZ KOSA */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Meet KYROZ KOSA. <br /><span className="text-[#d4af37]">Your AI Consultant.</span></h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Stop guessing. Ask KOSA. It answers from SOPs, recipes and costing files.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">✓</div>
                  <span className="text-gray-300">Instant answers from SOP Library</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">✓</div>
                  <span className="text-gray-300">Cost-saving insights on wastage logs</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">✓</div>
                  <span className="text-gray-300">24/7 staff training companion</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="bg-[#111] border border-[#333] rounded-2xl p-6 shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50"></div>
                <div className="flex gap-3 mb-6 border-b border-[#222] pb-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center font-bold text-black text-xl">K</div>
                  <div>
                    <h4 className="font-bold text-white">KYROZ KOSA</h4>
                    <p className="text-xs text-gray-500">Example</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-[#222] rounded-xl p-4 ml-auto w-[80%] text-sm text-gray-200">
                    What is the standard marination time for the house chicken tikka?
                  </div>
                  <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl p-4 mr-auto w-[90%] text-sm text-[#d4af37]">
                    Based on the Hungry Mak's SOP, the minimum marination time is 6 hours, and for best results, it should be marinated overnight.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Why KYROZ+ (comparison table) */}
      <section className="py-20 bg-[#0a0a0a] px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 flex flex-col md:block">
              <span>Franchise-style support.</span>
              <span>Without the franchise.</span>
            </h2>
          </div>

          {/* Mobile view: Stacked cards */}
          <div className="block md:hidden space-y-4 mb-12">
            {[
              { label: 'Total upfront cost', typical: '₹2 lakh – ₹2 crore', kyroz: '₹0' },
              { label: 'Franchise fee', typical: 'Yes', kyroz: 'None' },
              { label: 'Monthly royalty', typical: 'Yes', kyroz: 'None' },
              { label: 'Brand name', typical: "Franchisor's", kyroz: 'Yours' },
              { label: 'Taste', typical: 'Fixed by franchisor', kyroz: 'Your signature taste' },
              { label: 'Training and kitchen setup', typical: 'Yes', kyroz: 'Yes' },
              { label: 'Software', typical: 'Varies', kyroz: 'Included' },
            ].map((item, index) => (
              <div key={index} className="bg-[#111] border border-[#222] p-5 rounded-xl text-left">
                <div className="font-bold text-white text-lg mb-3">{item.label}</div>
                <div className="text-sm text-gray-400 mb-1">Typical franchise: <span className="text-gray-300 font-medium">{item.typical}</span></div>
                <div className="text-sm font-bold text-[#d4af37]">KYROZ+: {item.kyroz}</div>
              </div>
            ))}
          </div>

          {/* Desktop view: Table */}
          <div className="hidden md:block overflow-x-auto mb-12">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-4 border-b border-[#333] text-gray-500 w-1/3"></th>
                  <th className="p-4 border-b border-[#333] text-white font-bold text-lg w-1/3">Typical franchise</th>
                  <th className="p-4 border-b border-[#333] text-[#d4af37] font-bold text-lg w-1/3">KYROZ+</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr>
                  <td className="p-4 border-b border-[#222] font-medium">Total upfront cost</td>
                  <td className="p-4 border-b border-[#222]">₹2 lakh – ₹2 crore</td>
                  <td className="p-4 border-b border-[#222] text-[#d4af37] font-bold">₹0</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-[#222] font-medium">Franchise fee</td>
                  <td className="p-4 border-b border-[#222]">Yes</td>
                  <td className="p-4 border-b border-[#222] text-[#d4af37] font-bold">None</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-[#222] font-medium">Monthly royalty</td>
                  <td className="p-4 border-b border-[#222]">Yes</td>
                  <td className="p-4 border-b border-[#222] text-[#d4af37] font-bold">None</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-[#222] font-medium">Brand name</td>
                  <td className="p-4 border-b border-[#222]">Franchisor's</td>
                  <td className="p-4 border-b border-[#222] text-[#d4af37] font-bold">Yours</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-[#222] font-medium">Taste</td>
                  <td className="p-4 border-b border-[#222]">Fixed by franchisor</td>
                  <td className="p-4 border-b border-[#222] text-[#d4af37] font-bold">Your signature taste</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-[#222] font-medium">Training and kitchen setup</td>
                  <td className="p-4 border-b border-[#222]">Yes</td>
                  <td className="p-4 border-b border-[#222] text-[#d4af37] font-bold">Yes</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-[#222] font-medium">Software</td>
                  <td className="p-4 border-b border-[#222]">Varies</td>
                  <td className="p-4 border-b border-[#222] text-[#d4af37] font-bold">Included</td>
                </tr>
              </tbody>
            </table>
          </div>

          <ul className="space-y-4 max-w-2xl mx-auto bg-[#111] p-8 rounded-2xl border border-[#222]">
            <li className="flex items-center gap-3 text-lg text-gray-300"><span className="text-[#d4af37]">✔</span> Base formula + SOP + Software</li>
            <li className="flex items-center gap-3 text-lg text-gray-300"><span className="text-[#d4af37]">✔</span> Less dependence on a head chef</li>
            <li className="flex items-center gap-3 text-lg text-gray-300"><span className="text-[#d4af37]">✔</span> Consistent quality, your signature taste</li>
            <li className="flex items-center gap-3 text-lg text-gray-300"><span className="text-[#d4af37]">✔</span> Track and control food cost</li>
            <li className="flex items-center gap-3 text-lg text-gray-300"><span className="text-[#d4af37]">✔</span> Track wastage</li>
            <li className="flex items-center gap-3 text-lg text-gray-300"><span className="text-[#d4af37]">✔</span> See where your profit comes from</li>
          </ul>
        </div>
      </section>

      {/* 9. Pricing Section */}
      <section id="pricing" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 flex flex-col md:block">
            <span>Simple pricing.</span>
            <span>No franchise fee.</span>
            <span>No royalty.</span>
          </h2>
          <p className="text-gray-400 mb-16 text-lg flex flex-col md:block">
            <span>Your brand. Your signature taste.</span>
            <span>We give you the system.</span>
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left mb-16">
            {/* Starter Plan */}
            <div className="bg-[#111] border border-[#222] rounded-3xl p-8 hover:border-[#444] transition flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">KYROZ Starter</h3>
              <div className="flex flex-col mb-6">
                <span className="text-xl font-bold text-gray-500 line-through">₹{pricing.starter.price}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">₹{getFinalPrice(pricing.starter)}</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <span className="text-[#d4af37] text-sm font-bold mt-1">Founding Member Price</span>
              </div>
              <p className="text-gray-400 text-sm mb-6 pb-6 border-b border-[#222]">Billing and team control.</p>
              <div className="mb-6">
                <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-2">Best For:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• New restaurant</li>
                  <li>• Café</li>
                  <li>• Single cuisine setup</li>
                  <li>• Small outlet</li>
                </ul>
              </div>
              <div className="mb-8 flex-1">
                <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Includes:</h4>
                <ul className="space-y-3">
                  {['POS Terminal', 'KOT Display', 'WhatsApp Billing', 'Customer Directory', 'Sales Analytics', 'Team Management', '1 Cuisine SOP Library Access'].map(feature => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                      <span className="text-[#d4af37]">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="w-full block text-center py-3 rounded-xl border border-[#333] hover:bg-[#222] transition font-medium">Get Started</Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-b from-[#1a1505] to-[#111] border border-[#d4af37]/50 rounded-3xl p-8 relative transform md:-translate-y-4 shadow-[0_10px_40px_rgba(212,175,55,0.15)] flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d4af37] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Recommended</div>
              <h3 className="text-xl font-bold text-[#d4af37] mb-2 uppercase tracking-widest">KYROZ Premium</h3>
              <div className="flex flex-col mb-6">
                <span className="text-xl font-bold text-gray-500 line-through">₹{pricing.growth.price}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-[#d4af37]">₹{getFinalPrice(pricing.growth)}</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <span className="text-[#d4af37] text-sm font-bold mt-1">Founding Member Price</span>
              </div>
              <p className="text-gray-400 text-sm mb-6 pb-6 border-b border-[#222]">The kitchen system that runs without a head chef.</p>
              <div className="mb-6">
                <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-2">Best For:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Running restaurants</li>
                  <li>• Multi-cuisine restaurants</li>
                  <li>• Owners focused on profit and consistency</li>
                </ul>
              </div>
              <div className="mb-8 flex-1">
                <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Includes:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-white font-medium">
                    <span className="text-[#d4af37]">✓</span> Everything in Starter
                  </li>
                  {['Full SOP Library', 'KYROZ+ Base Access', 'Costing Master', 'Inventory Management', 'KYROZ KOSA (AI Assistance)', 'Menu Engineering', 'Priority Support'].map(feature => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                      <span className="text-[#d4af37]">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="w-full block text-center py-3 rounded-xl bg-[#d4af37] text-black hover:bg-[#c5a028] transition font-bold">Get Premium</Link>
            </div>

            {/* Scale Plan */}
            <div className="bg-[#111] border border-[#222] rounded-3xl p-8 hover:border-[#444] transition flex flex-col relative overflow-hidden">
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">KYROZ Scale</h3>
              <div className="flex flex-col mb-6">
                <span className="text-xl font-bold text-gray-500 line-through">₹{pricing.scale.price}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">₹{getFinalPrice(pricing.scale)}</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <span className="text-[#d4af37] text-sm font-bold mt-1">Founding Member Price</span>
              </div>
              <p className="text-gray-400 text-sm mb-6 pb-6 border-b border-[#222]">Multi-outlet growth.</p>
              <div className="mb-6">
                <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-2">Best For:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Growing restaurant brands</li>
                  <li>• Multi-outlet businesses</li>
                  <li>• Expansion-focused owners</li>
                </ul>
              </div>
              <div className="mb-8 flex-1">
                <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Includes:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-white font-medium">
                    <span className="text-[#d4af37]">✓</span> Everything in Premium
                  </li>
                  {['Multi-Outlet Dashboard', 'Marketing Engine'].map(feature => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                      <span className="text-[#d4af37]">✓</span> {feature}
                    </li>
                  ))}
                  {['Advanced Business Intelligence', 'Premium AI Restaurant Consultant'].map(feature => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-400">
                      <span className="text-gray-500 text-xs mt-0.5 border border-gray-600 rounded px-1">SOON</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full block text-center py-3 rounded-xl border border-[#333] text-gray-500 font-bold cursor-not-allowed">Coming Soon</div>
            </div>
          </div>

          {/* Founding Offer */}
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#1a1505] to-[#111] p-10 rounded-3xl border border-[#d4af37]/30 shadow-[0_0_30px_rgba(212,175,55,0.1)] flex flex-col justify-center">
            <h3 className="text-xl md:text-2xl font-black text-[#d4af37] mb-2 uppercase tracking-widest">FOUNDING MEMBER OFFER: First 50 Restaurants Only</h3>

            <div className="space-y-4 mb-8 mt-6">
              <div className="flex justify-between items-center bg-black/40 px-6 py-4 rounded-xl border border-white/5">
                <span className="text-gray-300 font-bold uppercase tracking-wider">Starter</span>
                <span className="text-2xl font-black text-white">₹{getFinalPrice(pricing.starter)}<span className="text-sm text-gray-500 font-normal">/mo</span></span>
              </div>
              <div className="flex justify-between items-center bg-black/40 px-6 py-4 rounded-xl border border-white/5">
                <span className="text-gray-300 font-bold uppercase tracking-wider">Premium</span>
                <span className="text-2xl font-black text-[#d4af37]">₹{getFinalPrice(pricing.growth)}<span className="text-sm text-gray-500 font-normal">/mo</span></span>
              </div>
            </div>

            <div className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 font-bold rounded-lg text-center uppercase tracking-wider text-sm mx-auto">
              24 months founder pricing lock
            </div>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="border-t border-[#222] py-8 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <div className="text-2xl font-extrabold tracking-tighter text-[#d4af37] mb-2">
              KYROZ+
            </div>
            <div className="text-sm font-medium text-gray-400">powered by Aroma Agro International</div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <a href="tel:+917887009800" className="hover:text-[#d4af37] transition">+91 78870 09800</a>
            <a href="mailto:info@kyrozplus.com" className="hover:text-[#d4af37] transition">info@kyrozplus.com</a>
            <Link href="/privacy-policy" className="hover:text-[#d4af37] transition">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-[#d4af37] transition">Terms of Service</Link>
          </div>

          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} KYROZ+. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
