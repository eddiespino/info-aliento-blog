import NetworkStatus from '@/components/NetworkStatus';
import FeaturedWitness from '@/components/FeaturedWitness';
import Debug from '@/components/Debug';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Home() {
  return (
    <div>
      {/* Hero Section with Featured Witness */}
      <section id="home" className="relative bg-background overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 pt-8 pb-8 sm:pt-16 sm:pb-16 md:pt-20 md:pb-20 lg:pt-28 lg:pb-28 overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                  <span className="block">Empower the</span>
                  <span className="block text-primary">Hive Blockchain</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Vote for trusted witnesses to secure the network and support the Aliento project's vision for a decentralized future.
                </p>

                <div className="mt-10 flex gap-3 justify-center">
                  <Link href="/witnesses">
                    <Button className="rounded-md px-5 py-3 font-medium">
                      View Top Witnesses
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" className="rounded-md px-5 py-3 font-medium">
                      About Aliento
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Images for decoration - Blockchain Technology Concept */}
        <div className="absolute inset-y-0 right-0 -z-10 w-1/2 bg-gradient-to-r from-background to-muted opacity-70"></div>
        <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 -z-10 w-full h-full opacity-10">
          <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop" alt="Blockchain Background" className="w-full h-full object-cover" />
        </div>
      </section>
      
      {/* Network Status Section */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <NetworkStatus />
        </div>
      </section>
      
      {/* Featured Witness Section (Aliento) */}
      <section id="about" className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedWitness />
          <div className="mt-12">
            <Debug />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/80 to-secondary/80 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Join the Hive Blockchain Community</h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Participate in a truly decentralized ecosystem, support witnesses, and help shape the future of the blockchain.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://peakd.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md bg-card text-primary hover:bg-card/90 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Join Hive
            </a>
            <a 
              href="https://hive.io/whitepaper.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center px-5 py-3 border border-primary-foreground text-base font-medium rounded-md text-primary-foreground hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary-foreground"
            >
              Read the Whitepaper
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
