import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-warm-white border-t border-pearl-soft mt-12 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 rounded-full bg-pearl-red" />
            <span className="font-bold text-2xl tracking-tight text-dark-text">Pearlsport</span>
          </Link>
          <p className="text-muted-text text-sm max-w-sm mb-6">
            Northern Uganda's premier game coverage. Bringing you the latest news, fixtures, and match reports for local sports across Lira, Lango, and beyond.
          </p>
          <div className="text-sm text-muted-text">
            &copy; {new Date().getFullYear()} Pearlsport. All rights reserved.
          </div>
        </div>

        <div>
          <h4 className="font-bold text-dark-text mb-4 uppercase text-xs tracking-widest">Sports</h4>
          <ul className="flex flex-col gap-2 text-sm text-muted-text">
            <li><Link href="/football" className="hover:text-pearl-red">Football</Link></li>
            <li><Link href="/athletics" className="hover:text-pearl-red">Athletics</Link></li>
            <li><Link href="/basketball" className="hover:text-pearl-red">Basketball</Link></li>
            <li><Link href="/boxing" className="hover:text-pearl-red">Boxing</Link></li>
            <li><Link href="/rugby" className="hover:text-pearl-red">Rugby</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-dark-text mb-4 uppercase text-xs tracking-widest">Company</h4>
          <ul className="flex flex-col gap-2 text-sm text-muted-text">
            <li><Link href="/about" className="hover:text-pearl-red">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-pearl-red">Contact</Link></li>
            <li><Link href="/terms" className="hover:text-pearl-red">Terms & Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-pearl-red">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
