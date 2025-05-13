"use client";
import React from 'react';
import { Activity, ArrowRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';


interface PricingCardProps {
  title: string;
  price: string | number;
  features: string[];
  featured?: boolean;
}

function App() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white transition-colors duration-300">

      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                Welcome to Watchman
            </h1>
            <p className="mt-4 text-lg text-gray-300 leading-relaxed">
              Gain immediate insights with dynamic alerts and comprehensive monitoring. Keep your vital services consistently online and performing at their best.
            </p>
            <div className="mt-10 flex space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
              >
                Start Monitoring <ArrowRight className="ml-2 h-5 w-5 inline-block" />
              </button>
              <button
                className="px-8 py-4 border border-gray-700 rounded-lg font-semibold text-gray-300 hover:border-gray-500 transition duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                onClick={()=>alert("Signup First! Lol")}
              >
                Explore Features
              </button>
            </div>
          </div>
          <div className="relative order-1 md:order-2">
            <div className="absolute top-0 left-0 w-full h-full bg-purple-900 rounded-lg opacity-30 blur-lg transform -translate-x-6 translate-y-6"></div>
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
              alt="Dashboard Interface"
              className="rounded-lg shadow-xl relative"
            />
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-gradient-to-b from-black via-gray-900 to-black bg-opacity-70 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-16">
            Transparent and Scalable Pricing Options
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Basic"
              price="19"
              features={[
                "Up to 5 monitors",
                "5-minute checks",
                "Email alerts",
                "Standard reporting"
              ]}
            />
            <PricingCard
              title="Pro"
              price="49"
              featured={true}
              features={[
                "Up to 25 monitors",
                "1-minute checks",
                "Multiple notification channels",
                "Advanced reporting",
                "Team collaboration"
              ]}
            />
            <PricingCard
              title="Enterprise"
              price="99+"
              features={[
                "Unlimited monitors",
                "Real-time checks",
                "Customizable alerts",
                "Priority support",
                "Dedicated account manager"
              ]}
            />
          </div>
          <p className="mt-8 text-center text-gray-400">
            Need a tailored solution? <a href="#" className="text-purple-400 hover:underline">Contact us</a>.
          </p>
        </div>
      </section>

      <footer className="bg-black bg-opacity-70 backdrop-blur-md text-gray-400 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="h-6 w-6 text-purple-400" />
                <span className="text-lg font-semibold text-white">Watchman</span>
              </div>
              <p className="text-sm leading-relaxed">
                The definitive solution for website and application monitoring.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-500 mb-3">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-500 mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-500 mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 <a href="https://woustachemax.github.io/portfolio/">Woustachemax</a>. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PricingCard({ title, price, features, featured = false }: PricingCardProps) {
  return (
    <div
      className={`rounded-lg shadow-md overflow-hidden ${
        featured
          ? 'bg-purple-600 text-white shadow-xl transform scale-105 transition-transform duration-200'
          : 'bg-gray-900 bg-opacity-70 backdrop-blur-md text-white hover:shadow-lg transition-shadow duration-200'
      }`}
    >
      <div className="p-8">
        <h3 className="text-xl font-bold mb-4 text-center">{title}</h3>
        <div className="text-center mb-6">
          <span className="text-4xl font-extrabold">${price}</span>
          <span className="text-sm text-gray-400">/month</span>
        </div>
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <Check className={`h-5 w-5 mr-2 ${featured ? 'text-white' : 'text-purple-400'}`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <button
          className={`w-full py-3 rounded-md font-semibold transition-colors duration-200 ${
            featured
              ? 'bg-white text-purple-600 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus-ring-offset-1'
              : 'bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus-ring-offset-1'
          }`}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;