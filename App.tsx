import { useEffect, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Menu, Minus, Plus, X } from 'lucide-react';

// EDIT BEFORE LAUNCH: replace this obvious placeholder with the brand's monitored inbox.
const CONTACT_EMAIL = 'hello@yourbrand.example';

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  color: string;
  note: string;
  mark: string;
};

const products: Product[] = [
  { id: 'mugs', name: 'The daily vessel', category: 'Custom mugs', price: '₹349', image: '/grab-editorial.jpg', color: '#ab4b2c', note: 'A little ritual, made yours. Add a name, a line, or your own artwork.', mark: '01 / OBJECT' },
  { id: 'tees', name: 'Heavy rotation tee', category: 'Graphic T-shirts', price: '₹799', image: '/grab-tee.jpg', color: '#5b3026', note: 'Roomy, lived-in cotton with graphics that do the talking.', mark: '02 / WEAR' },
  { id: 'stickers', name: 'Peel & keep set', category: 'Sticker sheets', price: '₹129', image: '/grab-editorial.jpg', color: '#c76a3a', note: 'Die-cut shapes for laptops, bottles, notebooks, and wherever.', mark: '03 / STICK' },
  { id: 'caps', name: 'Off-duty cap', category: 'Embroidered caps', price: '₹499', image: '/grab-editorial.jpg', color: '#394039', note: 'A soft-structured cap, finished with a mark of your choosing.', mark: '04 / SHADE' },
  { id: 'gifts', name: 'Made for someone', category: 'Personalised gifts', price: 'From ₹199', image: '/grab-editorial.jpg', color: '#7a5541', note: 'Small runs and personal touches for people worth keeping close.', mark: '05 / GIVE' },
];

function Intro({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'reach' | 'grab' | 'open'>('idle');
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || sessionStorage.getItem('grab-intro-seen') === 'yes') {
      onFinish();
      return;
    }
    const timers = [
      window.setTimeout(() => setPhase('reach'), 520),
      window.setTimeout(() => setPhase('grab'), 1320),
      window.setTimeout(() => setPhase('open'), 1920),
      window.setTimeout(onFinish, 2980),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [onFinish]);

  const finish = () => {
    sessionStorage.setItem('grab-intro-seen', 'yes');
    onFinish();
  };
  return (
    <div className={`intro-wrap ${phase === 'open' ? 'is-open' : ''}`} aria-label="THE GRAB CLUB opening animation">
      <div className={`intro-brand ${phase === 'grab' || phase === 'open' ? 'is-grabbed' : ''}`}>
        THE GRAB<br />CLUB
      </div>
      <div className={`hand-doodle ${phase === 'reach' || phase === 'grab' ? 'reach' : ''} ${phase === 'grab' ? 'grabbing' : ''} ${phase === 'open' ? 'open' : ''}`} aria-hidden="true">
        <svg viewBox="0 0 320 320" role="presentation">
          <g className="hand-open">
            <path className="hand-skin" d="M112 312 C109 299 108 285 109 270 L108 235 C107 220 93 217 81 209 L66 199 C53 190 64 171 78 179 L111 199 L108 157 C107 136 131 131 140 150 L150 190 L150 109 C150 87 175 85 181 107 L187 190 L195 125 C198 103 222 105 224 127 L218 203 L233 169 C241 149 264 160 259 180 L244 227 L236 251 C225 279 205 298 184 308 L183 312 Z" />
            <path className="hand-nail" d="M61 190 Q66 182 74 186 L82 193 Q75 199 67 197 Z" />
            <path className="hand-nail" d="M111 145 Q122 139 132 145 L133 154 Q121 157 111 153 Z" />
            <path className="hand-nail" d="M157 99 Q166 95 175 101 L176 110 Q166 114 157 109 Z" />
            <path className="hand-nail" d="M201 114 Q211 110 219 116 L217 126 Q207 129 198 124 Z" />
            <path className="hand-nail" d="M241 159 Q250 158 256 165 L252 174 Q244 176 237 171 Z" />
            <path className="hand-detail" d="M128 218 Q150 207 171 217 M137 239 Q158 230 177 237 M132 259 Q155 249 179 256 M143 168 Q148 165 154 169 M188 151 Q194 149 200 153 M222 169 Q227 168 232 172 M80 194 Q88 192 96 199" />
            <path className="hand-sleeve" d="M110 287 Q146 295 186 285 L190 313 Q151 321 113 314 Z" />
            <path className="cuff-stripe" d="M112 296 Q151 304 188 294 M113 304 Q151 312 189 302" />
          </g>
          <g className="grab-lines" aria-hidden="true">
            <path d="M76 221 L59 216 M86 256 L68 260 M246 200 L260 188 M254 228 L272 225" />
          </g>
        </svg>
      </div>
      <div className="intro-caption">{phase === 'grab' || phase === 'open' ? 'Good things don’t sit still.' : 'A little something is taking shape.'}</div>
      <button className="intro-skip mono" onClick={finish}>Skip intro <ArrowRight size={14} /></button>
    </div>
  );
}

function App() {
  const [intro, setIntro] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [formSent, setFormSent] = useState(false);
  const [email, setEmail] = useState('');

  const openProduct = (product: Product) => {
    setSelected(product);
    setQuantity(1);
    setFormSent(false);
  };
  const closeProduct = () => setSelected(null);
  const submitEnquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    const subject = `THE GRAB CLUB enquiry — ${selected.category}`;
    const body = [
      `Hi THE GRAB CLUB,`,
      '',
      `I'm interested in: ${selected.category} — ${selected.name}`,
      `Quantity: ${quantity}`,
      `Name: ${form.get('name')}`,
      `Reply email: ${form.get('replyEmail')}`,
      `Details: ${form.get('details') || 'Please share options and next steps.'}`,
      '',
      'Sent from the THE GRAB CLUB website.',
    ].join('\n');
    setFormSent(true);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  useEffect(() => {
    if (!selected && !mobileMenu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { closeProduct(); setMobileMenu(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, mobileMenu]);

  const navLink = (href: string, label: string) => (
    <a href={href} onClick={() => setMobileMenu(false)} className="nav-link">{label}</a>
  );

  return (
    <main className="noise">
      {intro && <Intro onFinish={() => setIntro(false)} />}
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="THE GRAB CLUB home">THE GRAB CLUB</a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navLink('#objects', 'Objects')}
          {navLink('#about', 'The idea')}
          {navLink('#enquire', 'Enquire')}
        </nav>
        <a className="edition-tag mono" href="#about">VANDRE ’26 <span>↗</span></a>
        <button className="mobile-menu-button" aria-label={mobileMenu ? 'Close navigation' : 'Open navigation'} onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X size={22} /> : <Menu size={22} />}
        </button>
        {mobileMenu && <nav className="mobile-nav menu-panel" aria-label="Mobile navigation">{navLink('#objects', 'Objects')}{navLink('#about', 'The idea')}{navLink('#enquire', 'Enquire')}</nav>}
      </header>

      <section id="top" className="hero">
        <div className="hero-topline mono"><span>Independent merch for your very own orbit</span><span>Jodhpur, India · 2026</span></div>
        <div className="hero-title-wrap">
          <p className="hero-kicker mono">A VANDRE ’26 project <span>— IIT Jodhpur</span></p>
          <h1>Good things<br />get <em className="serif">grabbed.</em></h1>
          <div className="hero-side-note mono">Make a little<br />room for yours.</div>
        </div>
        <div className="hero-image image-grain">
          <img src="/grab-editorial.jpg" alt="A styled still life of custom merchandise including a ceramic mug, graphic tee, stickers and cap" />
          <div className="hero-image-caption mono"><span>Selected objects / 01—05</span><span>Made to be yours</span></div>
          <a href="#objects" className="image-cta mono">Explore the club <ArrowDown size={14} /></a>
        </div>
        <div className="hero-bottomline"><p>For the things you carry.<br /><span>And the people you carry them for.</span></p><a href="#objects" className="round-arrow" aria-label="Explore merchandise"><ArrowDown size={20} /></a></div>
      </section>

      <section className="manifesto" id="about">
        <p className="section-index mono">01 / The idea</p>
        <div className="manifesto-content">
          <h2>Not just merch.<br /><span className="serif">A thing with a little</span><br />more <span className="orange-word">you</span> in it.</h2>
          <div className="manifesto-copy"><p>THE GRAB CLUB makes customised things for people, teams, and moments worth remembering. Start with a useful object. Add a mark that means something to you.</p><p>Part of VANDRE ’26 at IIT Jodhpur. Built around your idea, one small detail at a time.</p><a className="text-link mono" href="#enquire">Tell us what you're thinking <ArrowUpRight size={14} /></a></div>
        </div>
        <div className="manifesto-stamp mono"><span>Made for</span><strong>your<br />people.</strong><i>— GC / ’26</i></div>
      </section>

      <section className="objects-section" id="objects">
        <div className="section-header">
          <div><p className="section-index mono">02 / The good stuff</p><h2>Pick your<br /><span className="serif">starting point.</span></h2></div>
          <p className="section-aside">Choose an object.<br />Make it mean something.</p>
        </div>
        <div className="product-grid">
          {products.map((product, index) => (
            <button key={product.id} className={`product-card product-${product.id}`} onClick={() => openProduct(product)} aria-label={`View ${product.category}`}>
              <div className="product-visual image-grain" style={{ backgroundColor: product.color }}>
                <img className="product-art" src={product.image} alt="" style={{ objectPosition: index === 1 ? 'center' : `${index * 17 + 20}% center` }} />
                <span className="product-count mono">{product.mark}</span>
                <span className="product-arrow"><ArrowUpRight size={22} /></span>
                {index === 2 && <span className="sticker-graphic" aria-hidden="true"><b>GOOD<br />STUFF</b><i>★</i></span>}
                {index === 3 && <span className="cap-graphic" aria-hidden="true"><b>GC</b></span>}
              </div>
              <span className="product-info"><span><small className="mono">{product.category}</small><strong>{product.name}</strong></span><span className="product-price mono">{product.price}</span></span>
            </button>
          ))}
        </div>
        <p className="price-note mono">Indicative starting prices · final quote depends on customisation and quantity</p>
      </section>

      <section className="custom-section">
        <div className="custom-art image-grain">
          <img src="/grab-tee.jpg" alt="A heavyweight graphic tee against a textured orange wall" />
          <span className="custom-art-note mono">A blank is just<br />a beginning.</span>
        </div>
        <div className="custom-copy">
          <p className="section-index mono">03 / Made yours</p>
          <h2>Bring the<br /><span className="serif">inside joke.</span></h2>
          <p className="custom-description">A name. A sketch. A team thing only your group understands. Tell us the story; we’ll help find the right surface for it.</p>
          <a className="button-link mono" href="#enquire">Start with a thought <ArrowUpRight size={16} /></a>
          <div className="custom-foot mono"><span>01 — Share the idea</span><span>02 — Find the object</span><span>03 — Make it real</span></div>
        </div>
      </section>

      <section className="closing-note">
        <p className="section-index mono">04 / The next bit</p>
        <p className="closing-quote">Good taste is personal.<br /><span className="serif">So should your stuff be.</span></p>
        <a href="#enquire" className="round-arrow closing-arrow" aria-label="Go to enquiry form"><ArrowDown size={20} /></a>
      </section>

      <section className="enquiry-section" id="enquire">
        <div className="enquiry-heading"><p className="section-index mono">05 / Start a conversation</p><h2>Got a thing<br />in <span className="serif">mind?</span></h2></div>
        <div className="enquiry-body"><p>Give us the rough version. What you're making, who it's for, how many you might need. We’ll take it from there.</p><button className="button-link mono" onClick={() => openProduct(products[0])}>Make an enquiry <ArrowUpRight size={16} /></button>
          <div className="contact-note"><span className="mono">CONTACT EMAIL — PLACEHOLDER</span><strong>{CONTACT_EMAIL}</strong><small>Replace with your real contact email before launch. Enquiries open in your email app.</small></div>
        </div>
      </section>

      <footer className="site-footer">
        <a className="footer-wordmark" href="#top">THE GRAB<br />CLUB</a>
        <div className="footer-center mono"><span>VANDRE ’26</span><span>IIT Jodhpur</span><a href="#objects">Back to objects ↑</a></div>
        <div className="footer-right mono"><span>Independent merch, made personal.</span><span>© THE GRAB CLUB ’26</span></div>
      </footer>

      {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeProduct(); }}>
        <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
          <button className="modal-close" onClick={closeProduct} aria-label="Close product details"><X size={20} /></button>
          <div className="modal-image image-grain"><img src={selected.image} alt="" /><span className="mono">{selected.mark}</span></div>
          <div className="modal-content">
            <p className="section-index mono">{selected.category} · VANDRE ’26</p>
            <h2 id="product-modal-title">{selected.name}</h2>
            <p className="modal-note">{selected.note}</p>
            <div className="modal-price-row"><span className="mono">Indicative from</span><strong>{selected.price}</strong></div>
            <form onSubmit={submitEnquiry} className="enquiry-form">
              <label className="mono">Your name<input name="name" autoComplete="name" placeholder="Name" required /></label>
              <label className="mono">Email for our reply<input name="replyEmail" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
              <label className="mono">Quantity</label>
              <div className="quantity-control"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={15} /></button><span aria-live="polite">{quantity}</span><button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"><Plus size={15} /></button></div>
              <label className="mono">Details / custom idea<textarea name="details" rows={3} placeholder="Colours, artwork, dates, or anything else we should know…" /></label>
              <button className="submit-enquiry mono" type="submit">Prepare email enquiry <ArrowUpRight size={16} /></button>
              {formSent && <p className="form-status" role="status">Your email app should open with the enquiry ready. If it doesn’t, contact {CONTACT_EMAIL}.</p>}
              <small className="placeholder-warning">Email destination is a placeholder. The brand team must update it before launch.</small>
            </form>
          </div>
        </section>
      </div>}
    </main>
  );
}

export default App;
