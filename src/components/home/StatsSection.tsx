import { Users, CalendarCheck, HeartPulse, ShieldCheck } from "lucide-react";

const stats = [
  { id: 1, name: "Happy Users", value: "10,000+", icon: Users },
  { id: 2, name: "Appointments Booked", value: "5,000+", icon: CalendarCheck },
  { id: 3, name: "Health Insights Provided", value: "15,000+", icon: HeartPulse },
  { id: 4, name: "Secure Consultations", value: "100%", icon: ShieldCheck },
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-healthcare-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">Our Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center p-6 bg-white bg-opacity-10 rounded-lg shadow-md">
              <stat.icon className="h-12 w-12 text-white mb-4" />
              <p className="text-4xl font-bold mb-2">{stat.value}</p>
              <p className="text-lg font-medium">{stat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
