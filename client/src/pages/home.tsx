import NetworkStatus from '@/components/NetworkStatus';
import FeaturedWitness from '@/components/FeaturedWitness';
import Debug from '@/components/Debug';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Home() {
  return (
    <div>
      {/* Hero Section with Featured Witness */}
      <section id="home" className="relative bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 pt-8 pb-8 sm:pt-16 sm:pb-16 md:pt-20 md:pb-20 lg:pt-28 lg:pb-28 overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Empower the</span>
                  <span className="block text-primary-500">Hive Blockchain</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Vote for trusted witnesses to secure the network and support the Aliento project's vision for a decentralized future.
                </p>

                <div className="mt-10 flex gap-3 justify-center">
                  <Link href="/witnesses">
                    <Button className="rounded-md px-5 py-3 bg-primary-500 text-white font-medium hover:bg-primary-600">
                      View Top Witnesses
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" className="rounded-md px-5 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">
                      About Aliento
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Images for decoration - Blockchain Technology Concept */}
        <div className="absolute inset-y-0 right-0 -z-10 w-1/2 bg-gradient-to-r from-white to-gray-50"></div>
        <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 -z-10 w-full h-full opacity-10">
          <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop" alt="Blockchain Background" className="w-full h-full object-cover" />
        </div>
      </section>
      
      {/* Network Status Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <NetworkStatus />
        </div>
      </section>
      
      {/* Featured Witness Section (Aliento) */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedWitness />
          <div className="mt-12">
            <Debug />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-700 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join the Hive Blockchain Community</h2>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Participate in a truly decentralized ecosystem, support witnesses, and help shape the future of the blockchain.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://peakd.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md bg-white text-primary-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-700 focus:ring-white"
            >
              Join Hive
            </a>
            <a 
              href="https://hive.io/whitepaper.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-700 focus:ring-white"
            >
              Read the Whitepaper
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
