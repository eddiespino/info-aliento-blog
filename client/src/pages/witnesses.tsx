import WitnessList from "@/components/witnesses/WitnessList";

export default function Witnesses() {
  return (
    <section id="witnesses" className="py-16 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">Top Witnesses</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Witnesses are elected by Hive stakeholders to validate transactions and secure the blockchain. 
            Your votes determine who operates the network.
          </p>
        </div>
        
        <WitnessList />
      </div>
    </section>
  );
}
