import FeaturedWitness from "@/components/FeaturedWitness";

export default function About() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">About Aliento Witness</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Learn more about our mission and contribution to the Hive blockchain ecosystem.
          </p>
        </div>
        
        <FeaturedWitness />
        
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
          <p className="text-lg text-gray-600 mb-6">
            At Aliento, we're committed to supporting the growth and development of the Hive blockchain. Our mission is to provide reliable infrastructure, promote decentralization, and contribute to the overall health of the ecosystem.
          </p>
          
          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What We Do</h3>
          <ul className="list-disc pl-6 space-y-3 text-lg text-gray-600">
            <li>Maintain high-performance witness nodes to help secure the Hive blockchain</li>
            <li>Actively participate in governance decisions that shape the future of Hive</li>
            <li>Develop and support tools that enhance the user experience on Hive</li>
            <li>Contribute to the community through educational content and support</li>
            <li>Collaborate with other witnesses and stakeholders to improve the network</li>
          </ul>
          
          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Reliability</h4>
              <p className="text-gray-600">We maintain our infrastructure with the highest standards of reliability and uptime.</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Transparency</h4>
              <p className="text-gray-600">We operate with full transparency in all our actions and decisions.</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Community</h4>
              <p className="text-gray-600">We prioritize the needs of the Hive community in everything we do.</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h4>
              <p className="text-gray-600">We continuously look for ways to improve and innovate within the ecosystem.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
