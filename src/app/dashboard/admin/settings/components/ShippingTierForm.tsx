// import React from 'react';
// import { FiPlus, FiTrash2, FiInfo } from 'react-icons/fi';
// import { FormField } from './FormField';

// export const ShippingSettings: React.FC<any> = ({ shippingConfigs, setShippingConfigs }) => {

//   const updateConfig = (type: 'local' | 'nationwide', newConfig: any) => {
//     setShippingConfigs((prev: any) => ({ ...prev, [type]: newConfig }));
//   };

//   const addTier = (type: 'local' | 'nationwide') => {
//     const current = shippingConfigs[type];
//     updateConfig(type, {
//       ...current,
//       tiers: [...current.tiers, { min: 0, max: 0, charge: 0 }],
//     });
//   };

//   // মূল পরিবর্তন এখানে: ভ্যালু সরাসরি স্ট্রিং হিসেবে পাঠাচ্ছি যাতে ইউজার মুছতে পারে
//   const updateTier = (type: 'local' | 'nationwide', index: number, field: string, rawValue: string) => {
//     const current = shippingConfigs[type];
//     const newTiers = [...current.tiers];
    
//     // ইউজার যদি সব মুছে ফেলে, তবে এটি খালি স্ট্রিং থাকবে। 
//     // এরপর ডাটাবেজে পাঠানোর সময় এটিকে 0 ধরে নিতে পারবেন।
//     newTiers[index] = { ...newTiers[index], [field]: rawValue };
//     updateConfig(type, { ...current, tiers: newTiers });
//   };

//   const deleteTier = (type: 'local' | 'nationwide', index: number) => {
//     const current = shippingConfigs[type];
//     updateConfig(type, {
//       ...current,
//       tiers: current.tiers.filter((_: any, i: number) => i !== index),
//     });
//   };

//   return (
//     <div className="space-y-8">
//       {(['local', 'nationwide'] as const).map((type) => (
//         <div key={type}>
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold text-gray-800 capitalize">{type} Shipping</h3>
//             <button onClick={() => addTier(type)} className="flex items-center gap-1 text-[#5CAF90] text-sm font-medium">
//               <FiPlus size={18} /> Add Tier
//             </button>
//           </div>
//           <div className="space-y-4">
//             {shippingConfigs[type].tiers.map((tier: any, index: number) => (
//               <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-xl items-end">
//                 <FormField name={`${type}-min-${index}`} label="Min Amount" type="number" value={tier.min} onChange={(e) => updateTier(type, index, 'min', e.target.value)} />
//                 <FormField name={`${type}-max-${index}`} label="Max Amount (0 = Unlimited)" type="number" value={tier.max} onChange={(e) => updateTier(type, index, 'max', e.target.value)} />
//                 <div className="flex gap-3">
//                   <FormField name={`${type}-charge-${index}`} label="Charge (৳)" type="number" value={tier.charge} onChange={(e) => updateTier(type, index, 'charge', e.target.value)} />
//                   <button onClick={() => deleteTier(type, index)} className="text-red-500 hover:text-red-600 mt-8">
//                     <FiTrash2 size={22} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };