'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import FormInput from '@/components/FormInput';
import Select from '@/components/Select';
import NumberInput from '@/components/NumberInput';
import Checkbox from '@/components/Checkbox';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { calculateFinalPrice, formatPrice } from '@/lib/db';

interface Airline {
  id: number;
  name: string;
}

interface Flight {
  id: number;
  airline_id: number;
  from_city_id: number;
  to_city_id: number;
  day_of_week: number;
  departure_time: string;
  arrival_time: string;
  to_city_name: string;
}

const travelClasses = [
  { value: 'الدرجة الاقتصادية', label: 'الدرجة الاقتصادية' },
  { value: 'درجة رجال الأعمال', label: 'درجة رجال الأعمال' },
  { value: 'الدرجة الأولى', label: 'الدرجة الأولى' }
];

const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export default function BookingPage() {
  const router = useRouter();
  
  // State variables
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedAirlineId, setSelectedAirlineId] = useState<string>('');
  const [selectedFlightId, setSelectedFlightId] = useState<string>('');
  const [passengerName, setPassengerName] = useState<string>('');
  const [travelClass, setTravelClass] = useState<string>('الدرجة الاقتصادية');
  const [bagsCount, setBagsCount] = useState<number>(0);
  const [medicalDiscount, setMedicalDiscount] = useState<boolean>(false);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [basePrice, setBasePrice] = useState<number>(0);

  // Fetch airlines on component mount
  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const response = await fetch('/api/airlines');
        const data = await response.json();
        setAirlines(data);
      } catch (error) {
        console.error('Error fetching airlines:', error);
      }
    };

    fetchAirlines();
  }, []);

  // Fetch flights when airline is selected
  useEffect(() => {
    const fetchFlights = async () => {
      if (!selectedAirlineId) {
        setFlights([]);
        return;
      }

      try {
        const response = await fetch(`/api/flights?airlineId=${selectedAirlineId}`);
        const data = await response.json();
        setFlights(data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    fetchFlights();
  }, [selectedAirlineId]);

  // Fetch price when flight is selected
  useEffect(() => {
    const fetchPrice = async () => {
      if (!selectedFlightId) {
        setBasePrice(0);
        return;
      }

      try {
        const flight = flights.find(f => f.id.toString() === selectedFlightId);
        if (flight) {
          const response = await fetch(`/api/price?fromCityId=${flight.from_city_id}&toCityId=${flight.to_city_id}`);
          const data = await response.json();
          setBasePrice(data.price);
        }
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };

    fetchPrice();
  }, [selectedFlightId, flights]);

  // Calculate final price when relevant inputs change
  useEffect(() => {
    const price = calculateFinalPrice(basePrice, travelClass, bagsCount, medicalDiscount);
    setFinalPrice(price);
  }, [basePrice, travelClass, bagsCount, medicalDiscount]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passengerName || !selectedFlightId) {
      alert('الرجاء إكمال جميع الحقول المطلوبة');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passengerName,
          flightScheduleId: parseInt(selectedFlightId),
          travelClass,
          bagsCount,
          medicalDiscount,
          finalPrice
        }),
      });

      if (response.ok) {
        // Show success message
        alert('تم حجز التذكرة بنجاح!');
        router.push('/');
      } else {
        const error = await response.json();
        alert(`خطأ في حجز التذكرة: ${error.message}`);
      }
    } catch (error) {
      console.error('Error booking ticket:', error);
      alert('حدث خطأ أثناء حجز التذكرة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header title="حجز تذكرة جديدة" showBackButton onBack={() => router.push('/')} />

      <div className="flex-1 p-8">
        <Card className="max-w-3xl mx-auto animate-fadeIn">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="اسم المسافر"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              placeholder="أدخل اسم المسافر"
              required
            />

            <Select
              label="شركة الطيران"
              value={selectedAirlineId}
              onChange={(e) => {
                setSelectedAirlineId(e.target.value);
                setSelectedFlightId('');
              }}
              options={airlines.map(airline => ({
                value: airline.id.toString(),
                label: airline.name
              }))}
              placeholder="اختر شركة الطيران"
              required
            />

            <Select
              label="الرحلة"
              value={selectedFlightId}
              onChange={(e) => setSelectedFlightId(e.target.value)}
              options={flights.map(flight => ({
                value: flight.id.toString(),
                label: `${flight.to_city_name} - ${daysOfWeek[flight.day_of_week]} - ${flight.departure_time}`
              }))}
              placeholder="اختر الرحلة"
              required
            />

            <Select
              label="درجة السفر"
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value)}
              options={travelClasses}
              required
            />

            <NumberInput
              label="عدد الحقائب"
              value={bagsCount}
              onChange={setBagsCount}
              min={0}
              max={5}
            />

            <Checkbox
              label="خصم طبي"
              checked={medicalDiscount}
              onChange={(e) => setMedicalDiscount(e.target.checked)}
            />

            <div className="form-group">
              <label className="form-label text-black font-bold">السعر النهائي</label>
              <div className="text-2xl font-bold text-blue-500">{formatPrice(finalPrice)}</div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                variant="success"
                className="px-8 py-3 text-lg"
                disabled={isLoading}
              >
                {isLoading ? 'جاري الحجز...' : 'تأكيد الحجز'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
