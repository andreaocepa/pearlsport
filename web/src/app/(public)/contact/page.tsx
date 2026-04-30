export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl min-h-[60vh]">
      <h1 className="text-4xl font-bold text-dark-text mb-6">Contact Us</h1>
      <div className="card p-8 bg-warm-white border-pearl-soft">
        <p className="text-muted-text mb-6">
          Have a tip? Want to write for Pearlsport? Or just want to say hello? Reach out to us.
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-dark-text text-sm uppercase tracking-wider">Email</h3>
            <p className="text-pearl-red font-bold">editor@pearlsport.ug</p>
          </div>
          <div>
            <h3 className="font-bold text-dark-text text-sm uppercase tracking-wider">Location</h3>
            <p className="text-muted-text">Lira City, Northern Uganda</p>
          </div>
        </div>
      </div>
    </div>
  );
}
