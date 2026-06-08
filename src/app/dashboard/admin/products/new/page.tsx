// "use client";

// import React, { useState, useEffect, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import {
//   FiArrowLeft,
//   FiSave,
//   FiImage,
//   FiX,
//   FiPlus,
//   FiInfo,
//   FiSettings,
//   FiDollarSign,
//   FiTag,
//   FiList,
//   FiTrash2,
//   FiBox,
//   FiLayers,
// } from "react-icons/fi";
// import {
//   useCreateProductMutation,
//   useUpdateProductMutation,
//   useGetProductByIdQuery,
//   useGetProductsQuery,
// } from "@/redux/api/productApi";
// import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
// import { useGetUnitsQuery } from "@/redux/api/unitApi";

// import { toast } from "react-hot-toast";
// import { useGetBrandsQuery } from "@/redux/api/brandApi";

// const ProductFormInner = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const productId = searchParams.get("id");
//   const isEditing = !!productId;

//   const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
//   const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
//   const { data: productToEdit } = useGetProductByIdQuery(productId, {
//     skip: !isEditing,
//   });
//   const { data: categoriesData } = useGetCategoriesQuery({});
//   const { data: unitsData } = useGetUnitsQuery({});
//   const { data: allProductsData } = useGetProductsQuery({ limit: 100 });
//   const { data: brandsData } = useGetBrandsQuery({}); // 👈 ব্র্যান্ড ডাটা কুয়েরি করা হয়েছে

//   const [formData, setFormData] = useState<any>({
//     name: "",
//     slug: "",
//     description: "",
//     shortDescription: "",
//     productType: "single",
//     costPrice: "",
//     regularPrice: "",
//     salePrice: "",
//     stock: "",
//     sku: "",
//     lowStockAlert: 5,
//     categoryID: "",
//     unit: "",
//     brandID: "nonebrand", // 👈 ডিফল্ট ভ্যালু "nonebrand" সেট করা হয়েছে
//     status: "active",
//     isFeatured: false,
//     isNew: true,
//     isOnSale: false,
//     lowdown: [],
//     specifications: [],
//     variants: [],
//     comboItems: [], 
//     freeShipping: false,
//     shippingCost: "",
//     weight: "",
//     dimensions: { length: "", width: "", height: "" },
//     metaTitle: "",
//     metaDescription: "",
//   });

//   const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
//   const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
//   const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
//   const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

//   useEffect(() => {
//     if (isEditing && productToEdit?.data) {
//       const prod = productToEdit.data;
//       setFormData({
//         ...formData,
//         ...prod,
//         categoryID: prod.categoryID?._id || prod.categoryID,
//         unit: prod.unit?._id || prod.unit,
//         brandID: prod.brandID?._id || prod.brandID || "nonebrand", // 👈 এডিট মোডে আইডি বাইন্ড করা হচ্ছে
//         dimensions: prod.dimensions || { length: "", width: "", height: "" },
//         specifications: prod.specifications || [],
//         variants: prod.variants || [],
//         comboItems: prod.comboItems || [],
//         lowdown: prod.lowdown || [],
//       });

//       if (prod.thumbnail) setThumbnailPreview(prod.thumbnail);
//       if (prod.images) setGalleryPreviews(prod.images);
//     }
//   }, [isEditing, productToEdit]);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >,
//   ) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;

//     if (name.includes(".")) {
//       const [parent, child] = name.split(".");
//       setFormData((prev: any) => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]:
//             type === "checkbox"
//               ? checked
//               : type === "number"
//                 ? value === ""
//                   ? ""
//                   : Number(value)
//                 : value,
//         },
//       }));
//     } else {
//       setFormData((prev: any) => ({
//         ...prev,
//         [name]:
//           type === "checkbox"
//             ? checked
//             : type === "number"
//               ? value === ""
//                 ? ""
//                 : Number(value)
//               : value,
//       }));
//     }

//     if (name === "name" && !isEditing) {
//       setFormData((prev: any) => ({
//         ...prev,
//         slug: value
//           .toLowerCase()
//           .replace(/ /g, "-")
//           .replace(/[^\w-]+/g, ""),
//       }));
//     }
//   };

//   const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setThumbnailFile(file);
//       setThumbnailPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length > 0) {
//       setGalleryFiles((prev) => [...prev, ...files]);
//       const newPreviews = files.map((file) => URL.createObjectURL(file));
//       setGalleryPreviews((prev) => [...prev, ...newPreviews]);
//     }
//   };

//   const removeGalleryImage = (index: number) => {
//     setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
//     setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   const addComboItem = () => {
//     setFormData((prev: any) => ({
//       ...prev,
//       comboItems: [...prev.comboItems, { productID: "", selectedVariant: "", quantity: 1 }],
//     }));
//   };

//   const handleComboItemChange = (index: number, field: string, value: any) => {
//     const availableProducts = allProductsData?.data || [];

//     setFormData((prev: any) => {
//       const updatedCombo = prev.comboItems.map((item: any, i: number) => {
//         if (i === index) {
//           if (field === "productID") {
//             const targetProduct = availableProducts.find((p: any) => p._id === value);
//             if (targetProduct && (!targetProduct.variants || targetProduct.variants.length === 0)) {
//               if ((targetProduct.stock || 0) <= 0) {
//                 toast.error(`"${targetProduct.name}" প্রোডাক্টটি স্টক আউট!`);
//                 return { ...item, productID: "", selectedVariant: "", quantity: "" };
//               }
//             }
//             return { ...item, productID: value, selectedVariant: "", quantity: 1 };
//           }

//           if (field === "selectedVariant") {
//             const targetProduct = availableProducts.find((p: any) => p._id === item.productID);
//             const targetVariant = targetProduct?.variants?.find((v: any) => v.variantName === value);

//             if (targetVariant && (targetVariant.stock || 0) <= 0) {
//               toast.error(`দুঃখিত! এই ভ্যারিয়েন্টটি (${value}) স্টক আউট।`);
//               return { ...item, selectedVariant: "" };
//             }
//             return { ...item, selectedVariant: value, quantity: 1 };
//           }

//           if (field === "quantity") {
//             if (value === "") return { ...item, quantity: "" };
            
//             const targetProduct = availableProducts.find((p: any) => p._id === item.productID);
//             let maxAvailableStock = targetProduct?.stock || 0;

//             if (targetProduct?.variants && targetProduct.variants.length > 0) {
//               const targetVariant = targetProduct.variants.find((v: any) => v.variantName === item.selectedVariant);
//               maxAvailableStock = targetVariant ? targetVariant.stock : 0;
//             }

//             const inputQty = Math.max(1, Number(value));

//             if (inputQty > maxAvailableStock) {
//               toast.error(`অ্যালার্ট: সর্বোচ্চ স্টক লিমিট ${maxAvailableStock} টি!`);
//               return { ...item, quantity: maxAvailableStock };
//             }

//             return { ...item, quantity: inputQty };
//           }
//         }
//         return item;
//       });
//       return { ...prev, comboItems: updatedCombo };
//     });
//   };

//   const removeComboItem = (index: number) => {
//     setFormData((prev: any) => ({
//       ...prev,
//       comboItems: formData.comboItems.filter(
//         (_: any, i: number) => i !== index,
//       ),
//     }));
//   };

//   const addVariant = () => {
//     setFormData((prev: any) => ({
//       ...prev,
//       variants: [
//         ...prev.variants,
//         {
//           variantName: "",
//           weightOrVolume: "",
//           regularPrice: "",
//           salePrice: "",
//           stock: "",
//           sku: "",
//         },
//       ],
//     }));
//   };

//   const handleVariantChange = (index: number, field: string, value: any) => {
//     const updatedVariants = [...formData.variants];
//     updatedVariants[index] = {
//       ...updatedVariants[index],
//       [field]: value === "" 
//         ? "" 
//         : ["weightOrVolume", "regularPrice", "salePrice", "stock"].includes(field)
//           ? Number(value)
//           : value,
//     };
//     setFormData((prev: any) => ({ ...prev, variants: updatedVariants }));
//   };

//   const removeVariant = (index: number) => {
//     setFormData((prev: any) => ({
//       ...prev,
//       variants: formData.variants.filter((_: any, i: number) => i !== index),
//     }));
//   };

//   const handleSpecChange = (index: number, field: string, value: string) => {
//     const newSpecs = [...formData.specifications];
//     newSpecs[index] = { ...newSpecs[index], [field]: value };
//     setFormData((prev: any) => ({ ...prev, specifications: newSpecs }));
//   };

//   const addSpecification = () => {
//     setFormData((prev: any) => ({
//       ...prev,
//       specifications: [...prev.specifications, { key: "", value: "" }],
//     }));
//   };

//   const removeSpecification = (index: number) => {
//     setFormData((prev: any) => ({
//       ...prev,
//       specifications: formData.specifications.filter(
//         (_: any, i: number) => i !== index,
//       ),
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.categoryID) return toast.error("Please select a category");
//     if (!formData.unit) return toast.error("Please select a unit");

//     const cleanedData = {
//       ...formData,
//       costPrice: formData.costPrice === "" ? 0 : formData.costPrice,
//       regularPrice: formData.regularPrice === "" ? 0 : formData.regularPrice,
//       salePrice: formData.salePrice === "" ? 0 : formData.salePrice,
//       stock: formData.stock === "" ? 0 : formData.stock,
//       variants: formData.variants.map((v: any) => ({
//         ...v,
//         weightOrVolume: v.weightOrVolume === "" ? 0 : v.weightOrVolume,
//         regularPrice: v.regularPrice === "" ? 0 : v.regularPrice,
//         salePrice: v.salePrice === "" ? 0 : v.salePrice,
//         stock: v.stock === "" ? 0 : v.stock,
//       })),
//       comboItems: formData.comboItems.filter((item: any) => item.productID !== "").map((item: any) => ({
//         ...item,
//         quantity: item.quantity === "" ? 1 : item.quantity
//       }))
//     };

//     if (formData.productType === "combo" && cleanedData.comboItems.length === 0) {
//       return toast.error("Please bind at least one valid product for Combo Bundle");
//     }

//     try {
//       const submissionData = new FormData();
//       Object.keys(cleanedData).forEach((key) => {
//         if (["specifications", "variants", "comboItems", "lowdown", "dimensions"].includes(key)) {
//           submissionData.append(key, JSON.stringify(cleanedData[key]));
//         } else {
//           submissionData.append(key, cleanedData[key]);
//         }
//       });

//       if (thumbnailFile) submissionData.append("thumbnail", thumbnailFile);
//       if (galleryFiles.length > 0) {
//         galleryFiles.forEach((file) => submissionData.append("images", file));
//       }

//       if (isEditing) {
//         await updateProduct({ id: productId, data: submissionData }).unwrap();
//         toast.success("Product updated successfully");
//       } else {
//         await createProduct(submissionData).unwrap();
//         toast.success("Product created successfully");
//       }
//       router.push("/dashboard/admin/products");
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Something went wrong on backend");
//     }
//   };

//   const categories = categoriesData?.data || [];
//   const units = unitsData?.data || [];
//   const availableProducts = allProductsData?.data || [];
//   const brands = brandsData?.data || []; // 👈 ডাটাবেজ থেকে আসা ব্র্যান্ডের তালিকা

//   return (
//     <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-8 pb-32">
//       <style jsx global>{`
//         input::-webkit-outer-spin-button,
//         input::-webkit-inner-spin-button {
//           -webkit-appearance: none;
//           margin: 0;
//         }
//         input[type="number"] {
//           -moz-appearance: textfield;
//         }
//       `}</style>

//       {/* Action Bar */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm sticky top-0 z-40">
//         <div className="flex items-center gap-4">
//           <Link
//             href="/dashboard/admin/products"
//             className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 text-gray-400 transition-all hover:text-gray-600"
//           >
//             <FiArrowLeft size={20} />
//           </Link>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">
//               {isEditing ? "Edit Product" : "Create Product"}
//             </h1>
//             <div className="flex items-center gap-2 mt-1">
//               <span className={`w-2 h-2 rounded-full ${formData.status === "active" ? "bg-green-500" : "bg-gray-400"}`}></span>
//               <p className="text-sm text-gray-500 capitalize">{formData.status} Mode</p>
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-3 w-full sm:w-auto">
//           <button
//             type="button"
//             onClick={() => router.push("/dashboard/admin/products")}
//             className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-200 rounded-md font-semibold text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
//           >
//             Discard
//           </button>
//           <button
//             type="submit"
//             disabled={isCreating || isUpdating}
//             className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-[#4F46E5] text-white rounded-md font-semibold hover:bg-[#4338CA] transition-all shadow-md disabled:opacity-50"
//           >
//             <FiSave size={20} />
//             {isCreating || isUpdating ? "Processing..." : isEditing ? "Update Product" : "Release Product"}
//           </button>
//         </div>
//       </div>

//       {/* Product Type Toggle */}
//       <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <FiLayers className="text-[#4F46E5]" size={20} />
//           <span className="text-sm font-bold text-gray-700">Choose Product Type:</span>
//         </div>
//         <div className="flex bg-gray-100 p-1 rounded-md">
//           <button
//             type="button"
//             onClick={() => setFormData((p: any) => ({ ...p, productType: "single" }))}
//             className={`px-6 py-1.5 rounded-md text-xs font-bold transition-all ${formData.productType === "single" ? "bg-white text-gray-800 shadow" : "text-gray-400"}`}
//           >
//             SINGLE PRODUCT
//           </button>
//           <button
//             type="button"
//             onClick={() => setFormData((p: any) => ({ ...p, productType: "combo" }))}
//             className={`px-6 py-1.5 rounded-md text-xs font-bold transition-all ${formData.productType === "combo" ? "bg-white text-gray-800 shadow" : "text-gray-400"}`}
//           >
//             COMBO BUNDLE
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//         {/* Left Side */}
//         <div className="lg:col-span-8 space-y-6">
//           {/* Basic Info */}
//           <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-6">
//             <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
//               <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
//                 <FiInfo size={22} />
//               </div>
//               <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
//             </div>

//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-gray-700">Product Title *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   required
//                   placeholder="Enter product name"
//                   className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#4F46E5] transition-all text-sm"
//                   value={formData.name}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="text-sm font-semibold text-gray-700">Product Slug</label>
//                   <input
//                     type="text"
//                     name="slug"
//                     placeholder="product-url-slug"
//                     className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-[#4F46E5] transition-all text-xs font-mono"
//                     value={formData.slug}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 {/* 🔥 ব্র্যান্ড ফিল্ড ড্রপডাউনে রূপান্তর করা হয়েছে এবং name="brandID" করা হয়েছে */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-semibold text-gray-700">Brand Name</label>
//                   <select
//                     name="brandID"
//                     className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#4F46E5] transition-all text-sm"
//                     value={formData.brandID}
//                     onChange={handleChange}
//                   >
//                     <option value="nonebrand">None / No Brand</option>
//                     {brands.map((b: any) => (
//                       <option key={b._id} value={b._id}>
//                         {b.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="text-sm font-semibold text-gray-700">Short Description *</label>
//                   <input
//                     type="text"
//                     name="shortDescription"
//                     required
//                     placeholder="Short brief about product"
//                     className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#4F46E5] transition-all text-sm"
//                     value={formData.shortDescription}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-semibold text-gray-700">Highlights / Lowdown (One per line)</label>
//                   <textarea
//                     name="lowdown"
//                     rows={2}
//                     placeholder="Premium Quality&#10;100% Organic"
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#4F46E5] transition-all text-sm"
//                     value={Array.isArray(formData.lowdown) ? formData.lowdown.join("\n") : ""}
//                     onChange={(e) => setFormData((p: any) => ({ ...p, lowdown: e.target.value.split("\n") }))}
//                   ></textarea>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-gray-700">Product Description</label>
//                 <textarea
//                   name="description"
//                   rows={6}
//                   placeholder="Write a detailed description..."
//                   className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-[#4F46E5] transition-all text-sm"
//                   value={formData.description || ""}
//                   onChange={handleChange}
//                 ></textarea>
//               </div>
//             </div>
//           </div>

//           {/* Pricing & Stock Panel */}
//           {formData.productType === "single" ? (
//             <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-6">
//               <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
//                 <div className="w-10 h-10 rounded-md bg-green-50 flex items-center justify-center text-green-600">
//                   <FiDollarSign size={22} />
//                 </div>
//                 <h2 className="text-lg font-bold text-gray-800">Pricing & Inventory (Base Product)</h2>
//               </div>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="space-y-1">
//                   <label className="text-xs font-bold text-gray-600">Cost Price (কেনা দাম)</label>
//                   <input
//                     type="number"
//                     name="costPrice"
//                     placeholder="0"
//                     onWheel={(e) => (e.target as HTMLInputElement).blur()}
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold outline-none focus:border-[#4F46E5]"
//                     value={formData.costPrice}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-xs font-bold text-gray-600">Regular Price * (মূল দাম)</label>
//                   <input
//                     type="number"
//                     name="regularPrice"
//                     required
//                     placeholder="0"
//                     onWheel={(e) => (e.target as HTMLInputElement).blur()}
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold outline-none focus:border-[#4F46E5]"
//                     value={formData.regularPrice}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-xs font-bold text-gray-600">Sale Price (অফার দাম)</label>
//                   <input
//                     type="number"
//                     name="salePrice"
//                     placeholder="0"
//                     onWheel={(e) => (e.target as HTMLInputElement).blur()}
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold text-red-500 outline-none focus:border-[#4F46E5]"
//                     value={formData.salePrice}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-xs font-bold text-gray-600">Stock * (মজুদ সংখ্যা)</label>
//                   <input
//                     type="number"
//                     name="stock"
//                     required
//                     placeholder="0"
//                     onWheel={(e) => (e.target as HTMLInputElement).blur()}
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold text-[#4F46E5] outline-none focus:border-[#4F46E5]"
//                     value={formData.stock}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               {/* Variants Section */}
//               <div className="pt-6 border-t border-gray-100 space-y-4">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h3 className="text-sm font-bold text-gray-700">Product Variants</h3>
//                     <p className="text-xs text-gray-400">Add different sizes, colors or weight variants.</p>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={addVariant}
//                     className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold border border-blue-200 rounded-md hover:bg-blue-600 hover:text-white transition-all shadow-sm"
//                   >
//                     + Add New Variant
//                   </button>
//                 </div>

//                 {formData.variants.map((v: any, idx: number) => (
//                   <div key={idx} className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-3 relative">
//                     <div className="absolute top-2 right-2">
//                       <button
//                         type="button"
//                         onClick={() => removeVariant(idx)}
//                         className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
//                       >
//                         <FiTrash2 size={16} />
//                       </button>
//                     </div>

//                     <p className="text-xs font-bold text-[#4F46E5]">Variant #{idx + 1}</p>

//                     <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
//                       <div>
//                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Variant Name *</label>
//                         <input
//                           type="text"
//                           placeholder="e.g. Red / XL"
//                           className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500 font-medium"
//                           value={v.variantName}
//                           onChange={(e) => handleVariantChange(idx, "variantName", e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Weight / Vol</label>
//                         <input
//                           type="number"
//                           placeholder="0"
//                           onWheel={(e) => (e.target as HTMLInputElement).blur()}
//                           className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500"
//                           value={v.weightOrVolume}
//                           onChange={(e) => handleVariantChange(idx, "weightOrVolume", e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reg. Price</label>
//                         <input
//                           type="number"
//                           placeholder="0"
//                           onWheel={(e) => (e.target as HTMLInputElement).blur()}
//                           className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500 font-bold"
//                           value={v.regularPrice}
//                           onChange={(e) => handleVariantChange(idx, "regularPrice", e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Sale Price</label>
//                         <input
//                           type="number"
//                           placeholder="0"
//                           onWheel={(e) => (e.target as HTMLInputElement).blur()}
//                           className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500 text-red-500 font-bold"
//                           value={v.salePrice}
//                           onChange={(e) => handleVariantChange(idx, "salePrice", e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Stock</label>
//                         <input
//                           type="number"
//                           placeholder="0"
//                           onWheel={(e) => (e.target as HTMLInputElement).blur()}
//                           className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500 font-bold text-blue-600"
//                           value={v.stock}
//                           onChange={(e) => handleVariantChange(idx, "stock", e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">SKU</label>
//                         <input
//                           type="text"
//                           className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500 font-mono"
//                           value={v.sku}
//                           onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             /* Combo Window */
//             <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-6">
//               <div className="flex items-center justify-between pb-4 border-b border-gray-100">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-md bg-purple-50 flex items-center justify-center text-purple-600">
//                     <FiBox size={22} />
//                   </div>
//                   <h2 className="text-lg font-bold text-gray-800">Combo Package Items</h2>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={addComboItem}
//                   className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-md text-sm font-bold hover:bg-purple-600 hover:text-white border border-purple-100 transition-all"
//                 >
//                   <FiPlus /> Bind Product
//                 </button>
//               </div>

//               {/* কম্বো বেস প্রাইসিং গ্রিড */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md items-end">
//                 <div>
//                   <label className="text-xs font-bold text-gray-500 block mb-1.5">Combo Cost Price (প্যাকেজের কেনা দাম)</label>
//                   <input
//                     type="number"
//                     name="costPrice"
//                     placeholder="0"
//                     onWheel={(e) => (e.target as HTMLInputElement).blur()}
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold h-10 outline-none focus:border-purple-500"
//                     value={formData.costPrice}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-bold text-gray-500 block mb-1.5">Combo Regular Price (প্যাকেজের বিক্রয় মূল্য)</label>
//                   <input
//                     type="number"
//                     name="regularPrice"
//                     placeholder="0"
//                     onWheel={(e) => (e.target as HTMLInputElement).blur()}
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold h-10 outline-none focus:border-purple-500"
//                     value={formData.regularPrice}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-bold text-gray-500 block mb-1.5">Combo Stock (প্যাকেজ কতটি রেডি আছে)</label>
//                   <input
//                     type="number"
//                     name="stock"
//                     placeholder="0"
//                     onWheel={(e) => (e.target as HTMLInputElement).blur()}
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold h-10 outline-none focus:border-purple-500"
//                     value={formData.stock}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               {/* ডাইনামিক কম্বো আইটেম সিলেকশন এরিয়া */}
//               <div className="space-y-3">
//                 {formData.comboItems.map((item: any, idx: number) => {
//                   const targetProduct = availableProducts.find((p: any) => p._id === item.productID);
//                   const availableVariants = targetProduct?.variants || [];
//                   const hasVariants = availableVariants.length > 0;

//                   return (
//                     <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-md items-end md:items-center shadow-sm">
//                       <div className="w-full md:flex-[2] min-w-0">
//                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Select Product (প্রোডাক্ট বাছুন)</label>
//                         <select
//                           className="w-full p-2 border border-gray-200 rounded text-sm bg-white h-10 outline-none focus:border-purple-500 font-medium truncate"
//                           value={item.productID || ""}
//                           onChange={(e) => handleComboItemChange(idx, "productID", e.target.value)}
//                         >
//                           <option value="">-- Choose Bound Product --</option>
//                           {availableProducts.map((p: any) => (
//                             <option key={p._id} value={p._id}>
//                               {p.name} ({p.variants?.length > 0 ? `${p.variants.length} Variants` : `Stock: ${p.stock ?? 0}`})
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div className="w-full md:flex-[1] min-w-0">
//                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Choose Variant (সাইজ / ওজন)</label>
//                         <select
//                           disabled={!item.productID || !hasVariants}
//                           className={`w-full p-2 border rounded text-sm h-10 outline-none transition-all font-medium ${
//                             item.productID && hasVariants 
//                               ? "border-purple-300 bg-purple-50/40 text-purple-900 focus:border-purple-500" 
//                               : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
//                           }`}
//                           value={item.selectedVariant || ""}
//                           onChange={(e) => handleComboItemChange(idx, "selectedVariant", e.target.value)}
//                         >
//                           {!item.productID ? (
//                             <option value="">Select product first</option>
//                           ) : !hasVariants ? (
//                             <option value="">No variants available</option>
//                           ) : (
//                             <>
//                               <option value="">-- Select Variant * --</option>
//                               {availableVariants.map((v: any, vIdx: number) => (
//                                 <option key={vIdx} value={v.variantName}>
//                                   {v.variantName} (Stock: {v.stock || 0})
//                                 </option>
//                               ))}
//                             </>
//                           )}
//                         </select>
//                       </div>

//                       <div className="w-full md:w-24 shrink-0">
//                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Quantity (পরিমাণ)</label>
//                         <input
//                           type="number"
//                           placeholder="1"
//                           onWheel={(e) => (e.target as HTMLInputElement).blur()}
//                           className="w-full p-2 border border-gray-200 rounded text-sm text-center font-bold h-10 outline-none focus:border-purple-500"
//                           value={item.quantity}
//                           onChange={(e) => handleComboItemChange(idx, "quantity", e.target.value)}
//                         />
//                       </div>

//                       <div className="shrink-0">
//                         <button
//                           type="button"
//                           onClick={() => removeComboItem(idx)}
//                           className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-md transition-all"
//                         >
//                           <FiTrash2 size={18} />
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Specifications */}
//           <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
//             <div className="flex justify-between items-center">
//               <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><FiList /> Specifications</h2>
//               <button
//                 type="button"
//                 onClick={addSpecification}
//                 className="px-3 py-1.5 bg-purple-50 text-purple-600 border border-purple-100 rounded text-xs font-bold hover:bg-purple-600 hover:text-white transition-all shadow-sm"
//               >
//                 + Add Row
//               </button>
//             </div>
//             <div className="space-y-2">
//               {formData.specifications.map((spec: any, idx: number) => (
//                 <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 rounded border border-gray-200 relative">
//                   <input
//                     type="text"
//                     placeholder="Key (e.g. Origin)"
//                     className="p-2 border border-gray-200 rounded text-sm bg-white outline-none focus:border-purple-500"
//                     value={spec.key}
//                     onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
//                   />
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       placeholder="Value"
//                       className="flex-1 p-2 border border-gray-200 rounded text-sm bg-white outline-none focus:border-purple-500"
//                       value={spec.value}
//                       onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
//                     />
//                     <button type="button" onClick={() => removeSpecification(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded">
//                       <FiTrash2 size={16} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right Side Sidebar */}
//         <div className="lg:col-span-4 space-y-6">
//           {/* Media Assets */}
//           <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
//             <h3 className="font-bold text-gray-800 flex items-center gap-2"><FiImage /> Media Assets</h3>
//             <div className="space-y-2">
//               <label className="text-xs font-bold text-gray-400 block">Thumbnail Image *</label>
//               <div className="border-2 border-dashed border-gray-200 rounded-md p-4 text-center bg-gray-50 relative hover:bg-gray-100 transition-colors cursor-pointer">
//                 <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleThumbnailSelect} />
//                 <span className="text-xs text-gray-500">Upload Main Image</span>
//               </div>
//               {thumbnailPreview && (
//                 <div className="relative border rounded-md overflow-hidden bg-gray-50 aspect-square">
//                   <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-full object-cover" />
//                 </div>
//               )}
//             </div>

//             <div className="space-y-2 pt-2 border-t border-gray-100">
//               <label className="text-xs font-bold text-gray-400 block">Gallery Images</label>
//               <div className="border-2 border-dashed border-gray-200 rounded-md p-4 text-center bg-gray-50 relative hover:bg-gray-100 transition-colors cursor-pointer">
//                 <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleGallerySelect} />
//                 <span className="text-xs text-gray-500">Upload Extra Images</span>
//               </div>
//               {galleryPreviews.length > 0 && (
//                 <div className="grid grid-cols-3 gap-2 mt-2">
//                   {galleryPreviews.map((src, i) => (
//                     <div key={i} className="relative group border border-gray-200 rounded-md overflow-hidden aspect-square bg-gray-50">
//                       <img src={src} alt="Gallery Preview" className="w-full h-full object-cover" />
//                       <button
//                         type="button"
//                         onClick={() => removeGalleryImage(i)}
//                         className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <FiX size={10} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Promotion Options */}
//           <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
//             <h3 className="font-bold text-gray-800 flex items-center gap-2"><FiSettings /> Promotion</h3>
//             {[
//               { key: "isFeatured", label: "Featured Product", color: "bg-yellow-500" },
//               { key: "isOnSale", label: "On Sale Mode", color: "bg-rose-500" },
//               { key: "isNew", label: "New Arrival Badge", color: "bg-emerald-500" },
//             ].map((item) => (
//               <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50/50 rounded border border-gray-100 cursor-pointer">
//                 <span className="text-xs font-bold text-gray-600">{item.label}</span>
//                 <div className="relative">
//                   <input type="checkbox" name={item.key} className="sr-only" checked={formData[item.key]} onChange={handleChange} />
//                   <div className={`w-10 h-5 rounded-full transition-colors ${formData[item.key] ? item.color : "bg-gray-200"}`}></div>
//                   <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-all ${formData[item.key] ? "translate-x-5" : ""}`}></div>
//                 </div>
//               </label>
//             ))}
//           </div>

//           {/* Product Architecture */}
//           <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
//             <h3 className="font-bold text-gray-800 flex items-center gap-2"><FiTag /> Product Architecture</h3>
//             <div className="space-y-4">
//               <div className="space-y-1">
//                 <label className="text-xs font-bold text-gray-400 block">Category *</label>
//                 <select
//                   name="categoryID"
//                   required
//                   className="w-full p-2.5 border border-gray-200 bg-white text-sm rounded-md outline-none focus:border-[#4F46E5]"
//                   value={formData.categoryID}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((cat: any) => (
//                     <option key={cat._id} value={cat._id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="space-y-1">
//                 <label className="text-xs font-bold text-gray-400 block">Default Unit *</label>
//                 <select
//                   name="unit"
//                   required
//                   className="w-full p-2.5 border border-gray-200 bg-white text-sm rounded-md outline-none focus:border-[#4F46E5]"
//                   value={formData.unit}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Unit</option>
//                   {units.map((u: any) => (
//                     <option key={u._id} value={u._id}>
//                       {u.name || u.unit}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// };

// const ProductForm = () => (
//   <Suspense fallback={<div className="p-20 text-center text-[#4F46E5] font-bold text-sm tracking-widest">LOADING ENGINE...</div>}>
//     <ProductFormInner />
//   </Suspense>
// );

// export default ProductForm;

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiSave,
  FiImage,
  FiX,
  FiPlus,
  FiInfo,
  FiSettings,
  FiDollarSign,
  FiTag,
  FiList,
  FiTrash2,
  FiBox,
  FiLayers,
} from "react-icons/fi";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
  useGetProductsQuery,
} from "@/redux/api/productApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { useGetUnitsQuery } from "@/redux/api/unitApi";
import { toast } from "react-hot-toast";
import { useGetBrandsQuery } from "@/redux/api/brandApi";

const ProductFormInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const isEditing = !!productId;

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data: productToEdit } = useGetProductByIdQuery(productId, { skip: !isEditing });
  const { data: categoriesData } = useGetCategoriesQuery({});
  const { data: unitsData } = useGetUnitsQuery({});
  const { data: allProductsData } = useGetProductsQuery({ limit: 100 });
  const { data: brandsData } = useGetBrandsQuery({});

  const [formData, setFormData] = useState<any>({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    productType: "single",
    costPrice: "",
    regularPrice: "",
    salePrice: "",
    stock: "",
    sku: "",
    lowStockAlert: 5,
    categoryID: "",
    unit: "",
    brandID: "nonebrand",
    status: "active",
    isFeatured: false,
    isNew: true,
    isOnSale: false,
    lowdown: [],
    specifications: [],
    variants: [],
    comboItems: [],
    freeShipping: false,
    shippingCost: "",
    weight: "",
    dimensions: { length: "", width: "", height: "" },
    metaTitle: "",
    metaDescription: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (isEditing && productToEdit?.data) {
      const prod = productToEdit.data;
      setFormData({
        ...formData,
        ...prod,
        categoryID: prod.categoryID?._id || prod.categoryID,
        unit: prod.unit?._id || prod.unit,
        brandID: prod.brandID?._id || prod.brandID || "nonebrand",
        dimensions: prod.dimensions || { length: "", width: "", height: "" },
        specifications: prod.specifications || [],
        variants: prod.variants || [],
        comboItems: prod.comboItems || [],
        lowdown: prod.lowdown || [],
      });
      if (prod.thumbnail) setThumbnailPreview(prod.thumbnail);
      if (prod.images) setGalleryPreviews(prod.images);
    }
  }, [isEditing, productToEdit]);

  // selected unit label
  const units = unitsData?.data || [];
  const selectedUnit = units.find((u: any) => u._id === formData.unit);
  const unitLabel = selectedUnit?.shortName || selectedUnit?.name || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : type === "number" ? (value === "" ? "" : Number(value)) : value,
        },
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : type === "number" ? (value === "" ? "" : Number(value)) : value,
      }));
    }

    if (name === "name" && !isEditing) {
      setFormData((prev: any) => ({
        ...prev,
        slug: value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
      }));
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setThumbnailFile(file); setThumbnailPreview(URL.createObjectURL(file)); }
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryFiles((prev) => [...prev, ...files]);
      setGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== VARIANT =====
  const addVariant = () => {
    setFormData((prev: any) => ({
      ...prev,
      variants: [...prev.variants, { variantName: "", weightOrVolume: "", regularPrice: "", salePrice: "", stock: "", sku: "" }],
    }));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value === "" ? "" : ["weightOrVolume", "regularPrice", "salePrice", "stock"].includes(field) ? Number(value) : value,
    };
    setFormData((prev: any) => ({ ...prev, variants: updatedVariants }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev: any) => ({ ...prev, variants: formData.variants.filter((_: any, i: number) => i !== index) }));
  };

  // ===== COMBO =====
  const addComboItem = () => {
    setFormData((prev: any) => ({ ...prev, comboItems: [...prev.comboItems, { productID: "", selectedVariant: "", quantity: 1 }] }));
  };

  const handleComboItemChange = (index: number, field: string, value: any) => {
    const availableProducts = allProductsData?.data || [];
    setFormData((prev: any) => {
      const updatedCombo = prev.comboItems.map((item: any, i: number) => {
        if (i !== index) return item;
        if (field === "productID") {
          const targetProduct = availableProducts.find((p: any) => p._id === value);
          if (targetProduct && (!targetProduct.variants || targetProduct.variants.length === 0)) {
            if ((targetProduct.stock || 0) <= 0) { toast.error(`"${targetProduct.name}" স্টক আউট!`); return { ...item, productID: "", selectedVariant: "", quantity: "" }; }
          }
          return { ...item, productID: value, selectedVariant: "", quantity: 1 };
        }
        if (field === "selectedVariant") {
          const targetProduct = availableProducts.find((p: any) => p._id === item.productID);
          const targetVariant = targetProduct?.variants?.find((v: any) => v.variantName === value);
          if (targetVariant && (targetVariant.stock || 0) <= 0) { toast.error(`এই ভ্যারিয়েন্টটি (${value}) স্টক আউট।`); return { ...item, selectedVariant: "" }; }
          return { ...item, selectedVariant: value, quantity: 1 };
        }
        if (field === "quantity") {
          if (value === "") return { ...item, quantity: "" };
          const targetProduct = availableProducts.find((p: any) => p._id === item.productID);
          let maxStock = targetProduct?.stock || 0;
          if (targetProduct?.variants?.length > 0) {
            const v = targetProduct.variants.find((v: any) => v.variantName === item.selectedVariant);
            maxStock = v ? v.stock : 0;
          }
          const inputQty = Math.max(1, Number(value));
          if (inputQty > maxStock) { toast.error(`সর্বোচ্চ স্টক লিমিট ${maxStock} টি!`); return { ...item, quantity: maxStock }; }
          return { ...item, quantity: inputQty };
        }
        return item;
      });
      return { ...prev, comboItems: updatedCombo };
    });
  };

  const removeComboItem = (index: number) => {
    setFormData((prev: any) => ({ ...prev, comboItems: formData.comboItems.filter((_: any, i: number) => i !== index) }));
  };

  // ===== SPEC =====
  const addSpecification = () => {
    setFormData((prev: any) => ({ ...prev, specifications: [...prev.specifications, { key: "", value: "" }] }));
  };

  const handleSpecChange = (index: number, field: string, value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData((prev: any) => ({ ...prev, specifications: newSpecs }));
  };

  const removeSpecification = (index: number) => {
    setFormData((prev: any) => ({ ...prev, specifications: formData.specifications.filter((_: any, i: number) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryID) return toast.error("Please select a category");
    if (!formData.unit) return toast.error("Please select a unit");

    const cleanedData = {
      ...formData,
      costPrice: formData.costPrice === "" ? 0 : formData.costPrice,
      regularPrice: formData.regularPrice === "" ? 0 : formData.regularPrice,
      salePrice: formData.salePrice === "" ? 0 : formData.salePrice,
      stock: formData.stock === "" ? 0 : formData.stock,
      variants: formData.variants.map((v: any) => ({
        ...v,
        weightOrVolume: v.weightOrVolume === "" ? 0 : v.weightOrVolume,
        regularPrice: v.regularPrice === "" ? 0 : v.regularPrice,
        salePrice: v.salePrice === "" ? 0 : v.salePrice,
        stock: v.stock === "" ? 0 : v.stock,
      })),
      comboItems: formData.comboItems
        .filter((item: any) => item.productID !== "")
        .map((item: any) => ({ ...item, quantity: item.quantity === "" ? 1 : item.quantity })),
    };

    if (formData.productType === "combo" && cleanedData.comboItems.length === 0) {
      return toast.error("Please add at least one product for Combo Bundle");
    }

    try {
      const submissionData = new FormData();
      Object.keys(cleanedData).forEach((key) => {
        if (["specifications", "variants", "comboItems", "lowdown", "dimensions"].includes(key)) {
          submissionData.append(key, JSON.stringify(cleanedData[key]));
        } else {
          submissionData.append(key, cleanedData[key]);
        }
      });
      if (thumbnailFile) submissionData.append("thumbnail", thumbnailFile);
      galleryFiles.forEach((file) => submissionData.append("images", file));

      if (isEditing) {
        await updateProduct({ id: productId, data: submissionData }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(submissionData).unwrap();
        toast.success("Product created successfully");
      }
      router.push("/dashboard/admin/products");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];
  const availableProducts = allProductsData?.data || [];
  const hasVariants = formData.variants.length > 0;

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-8 pb-32">
      <style jsx global>{`
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/products" className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 text-gray-400 transition-all hover:text-gray-600">
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{isEditing ? "Edit Product" : "Create Product"}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${formData.status === "active" ? "bg-green-500" : "bg-gray-400"}`}></span>
              <p className="text-sm text-gray-500 capitalize">{formData.status} Mode</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button type="button" onClick={() => router.push("/dashboard/admin/products")}
            className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-200 rounded-md font-semibold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            Discard
          </button>
          <button type="submit" disabled={isCreating || isUpdating}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-[#4F46E5] text-white rounded-md font-semibold hover:bg-[#4338CA] transition-all shadow-md disabled:opacity-50">
            <FiSave size={20} />
            {isCreating || isUpdating ? "Processing..." : isEditing ? "Update Product" : "Release Product"}
          </button>
        </div>
      </div>

      {/* Product Type Toggle */}
      <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiLayers className="text-[#4F46E5]" size={20} />
          <span className="text-sm font-bold text-gray-700">Choose Product Type:</span>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-md">
          <button type="button" onClick={() => setFormData((p: any) => ({ ...p, productType: "single" }))}
            className={`px-6 py-1.5 rounded-md text-xs font-bold transition-all ${formData.productType === "single" ? "bg-white text-gray-800 shadow" : "text-gray-400"}`}>
            SINGLE PRODUCT
          </button>
          <button type="button" onClick={() => setFormData((p: any) => ({ ...p, productType: "combo" }))}
            className={`px-6 py-1.5 rounded-md text-xs font-bold transition-all ${formData.productType === "combo" ? "bg-white text-gray-800 shadow" : "text-gray-400"}`}>
            COMBO BUNDLE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ===== LEFT SIDE ===== */}
        <div className="lg:col-span-8 space-y-6">

          {/* Basic Info */}
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-600"><FiInfo size={22} /></div>
              <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Product Title *</label>
              <input type="text" name="name" required placeholder="Enter product name"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#4F46E5] transition-all text-sm"
                value={formData.name} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Product Slug</label>
                <input type="text" name="slug" placeholder="product-url-slug"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-[#4F46E5] transition-all text-xs font-mono"
                  value={formData.slug} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Brand</label>
                <select name="brandID" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#4F46E5] transition-all text-sm"
                  value={formData.brandID} onChange={handleChange}>
                  <option value="nonebrand">None / No Brand</option>
                  {brands.map((b: any) => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
            </div>

            {/* ✅ Category + Unit LEFT এ নিয়ে আসা */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Category *</label>
                <select name="categoryID" required
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#4F46E5] transition-all text-sm"
                  value={formData.categoryID} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {categories.map((cat: any) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Default Unit *</label>
                <select name="unit" required
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#4F46E5] transition-all text-sm"
                  value={formData.unit} onChange={handleChange}>
                  <option value="">Select Unit</option>
                  {units.map((u: any) => <option key={u._id} value={u._id}>{u.name} ({u.shortName})</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Short Description *</label>
                <input type="text" name="shortDescription" required placeholder="Short brief about product"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#4F46E5] transition-all text-sm"
                  value={formData.shortDescription} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Highlights (One per line)</label>
                <textarea name="lowdown" rows={2} placeholder="Premium Quality&#10;100% Organic"
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#4F46E5] transition-all text-sm"
                  value={Array.isArray(formData.lowdown) ? formData.lowdown.join("\n") : ""}
                  onChange={(e) => setFormData((p: any) => ({ ...p, lowdown: e.target.value.split("\n") }))} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Product Description</label>
              <textarea name="description" rows={6} placeholder="Write a detailed description..."
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-[#4F46E5] transition-all text-sm"
                value={formData.description || ""} onChange={handleChange} />
            </div>
          </div>

          {/* ===== PRICING & INVENTORY ===== */}
          {formData.productType === "single" ? (
            <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-md bg-green-50 flex items-center justify-center text-green-600"><FiDollarSign size={22} /></div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Pricing & Inventory</h2>
                  {/* ✅ variant থাকলে info দেখাও */}
                  {hasVariants && (
                    <p className="text-xs text-orange-500 font-medium mt-0.5">
                      ⚠️ Variant যোগ করা আছে — নিচের Base Price গুলো শুধু fallback হিসেবে কাজ করবে।
                    </p>
                  )}
                </div>
              </div>

              {/* ✅ Variant না থাকলে full pricing দেখাও, variant থাকলে শুধু cost + stock */}
              {!hasVariants ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Cost Price <span className="text-gray-400">(কেনা দাম)</span></label>
                    <input type="number" name="costPrice" placeholder="0" onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold outline-none focus:border-[#4F46E5]"
                      value={formData.costPrice} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Regular Price * <span className="text-gray-400">(মূল দাম)</span></label>
                    <input type="number" name="regularPrice" required placeholder="0" onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold outline-none focus:border-[#4F46E5]"
                      value={formData.regularPrice} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Sale Price <span className="text-gray-400">(অফার দাম)</span></label>
                    <input type="number" name="salePrice" placeholder="0" onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold text-red-500 outline-none focus:border-[#4F46E5]"
                      value={formData.salePrice} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Stock * <span className="text-gray-400">(মজুদ)</span></label>
                    <input type="number" name="stock" required placeholder="0" onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold text-[#4F46E5] outline-none focus:border-[#4F46E5]"
                      value={formData.stock} onChange={handleChange} />
                  </div>
                </div>
              ) : (
                // ✅ Variant থাকলে শুধু cost price দেখাও (stock variant থেকে auto calculate হবে)
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Cost Price <span className="text-gray-400">(কেনা দাম)</span></label>
                    <input type="number" name="costPrice" placeholder="0" onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold outline-none focus:border-[#4F46E5]"
                      value={formData.costPrice} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">SKU</label>
                    <input type="text" name="sku" placeholder="Auto-generated if empty"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-mono outline-none focus:border-[#4F46E5]"
                      value={formData.sku} onChange={handleChange} />
                  </div>
                  <div className="md:col-span-2 p-3 bg-blue-50 rounded-md border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium">
                      ℹ️ Variant product এ Stock এবং Price গুলো নিচের Variant Table থেকে নেওয়া হবে। Backend automatically সব variant এর stock যোগ করে total stock set করবে।
                    </p>
                  </div>
                </div>
              )}

              {/* Variants Section */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-gray-700">Product Variants</h3>
                    <p className="text-xs text-gray-400">
                      {unitLabel ? `Unit: "${unitLabel}" — প্রতিটি variant এ এই unit অনুযায়ী weight/volume দিন।` : "Add different sizes or weight variants."}
                    </p>
                  </div>
                  <button type="button" onClick={addVariant}
                    className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold border border-blue-200 rounded-md hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                    + Add Variant
                  </button>
                </div>

                {formData.variants.map((v: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#4F46E5]">Variant #{idx + 1}</p>
                      <button type="button" onClick={() => removeVariant(idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors">
                        <FiTrash2 size={15} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Variant Name *</label>
                        <input type="text" placeholder="e.g. 1kg / 500ml"
                          className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500 font-medium"
                          value={v.variantName} onChange={(e) => handleVariantChange(idx, "variantName", e.target.value)} />
                      </div>
                      <div>
                        {/* ✅ Unit label যোগ করা হয়েছে */}
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                          Weight/Vol {unitLabel && <span className="text-blue-500 normal-case">({unitLabel})</span>}
                        </label>
                        <input type="number" placeholder="0" onWheel={(e) => (e.target as HTMLInputElement).blur()}
                          className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500"
                          value={v.weightOrVolume} onChange={(e) => handleVariantChange(idx, "weightOrVolume", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reg. Price</label>
                        <input type="number" placeholder="0" onWheel={(e) => (e.target as HTMLInputElement).blur()}
                          className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500 font-bold"
                          value={v.regularPrice} onChange={(e) => handleVariantChange(idx, "regularPrice", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Sale Price</label>
                        <input type="number" placeholder="0" onWheel={(e) => (e.target as HTMLInputElement).blur()}
                          className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500 text-red-500 font-bold"
                          value={v.salePrice} onChange={(e) => handleVariantChange(idx, "salePrice", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Stock</label>
                        <input type="number" placeholder="0" onWheel={(e) => (e.target as HTMLInputElement).blur()}
                          className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500 font-bold text-blue-600"
                          value={v.stock} onChange={(e) => handleVariantChange(idx, "stock", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">SKU</label>
                        <input type="text"
                          className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500 font-mono"
                          value={v.sku} onChange={(e) => handleVariantChange(idx, "sku", e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ===== COMBO ===== */
            <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-purple-50 flex items-center justify-center text-purple-600"><FiBox size={22} /></div>
                  <h2 className="text-lg font-bold text-gray-800">Combo Package Items</h2>
                </div>
                <button type="button" onClick={addComboItem}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-md text-sm font-bold hover:bg-purple-600 hover:text-white border border-purple-100 transition-all">
                  <FiPlus /> Bind Product
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1.5">Combo Cost Price</label>
                  <input type="number" name="costPrice" placeholder="0" onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold h-10 outline-none focus:border-purple-500"
                    value={formData.costPrice} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1.5">Combo Regular Price *</label>
                  <input type="number" name="regularPrice" placeholder="0" onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold h-10 outline-none focus:border-purple-500"
                    value={formData.regularPrice} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1.5">Combo Stock *</label>
                  <input type="number" name="stock" placeholder="0" onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold h-10 outline-none focus:border-purple-500"
                    value={formData.stock} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-3">
                {formData.comboItems.map((item: any, idx: number) => {
                  const targetProduct = availableProducts.find((p: any) => p._id === item.productID);
                  const availableVariants = targetProduct?.variants || [];
                  const hasVariantsInProduct = availableVariants.length > 0;

                  return (
                    <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-md items-end shadow-sm">
                      <div className="w-full md:flex-[2] min-w-0">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Select Product</label>
                        <select className="w-full p-2 border border-gray-200 rounded text-sm bg-white h-10 outline-none focus:border-purple-500 font-medium"
                          value={item.productID || ""} onChange={(e) => handleComboItemChange(idx, "productID", e.target.value)}>
                          <option value="">-- Choose Product --</option>
                          {availableProducts.map((p: any) => (
                            <option key={p._id} value={p._id}>
                              {p.name} ({p.variants?.length > 0 ? `${p.variants.length} Variants` : `Stock: ${p.stock ?? 0}`})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-full md:flex-[1] min-w-0">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Variant</label>
                        <select disabled={!item.productID || !hasVariantsInProduct}
                          className={`w-full p-2 border rounded text-sm h-10 outline-none font-medium ${item.productID && hasVariantsInProduct ? "border-purple-300 bg-purple-50/40 text-purple-900 focus:border-purple-500" : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"}`}
                          value={item.selectedVariant || ""} onChange={(e) => handleComboItemChange(idx, "selectedVariant", e.target.value)}>
                          {!item.productID ? <option value="">Select product first</option>
                            : !hasVariantsInProduct ? <option value="">No variants</option>
                            : (<>
                              <option value="">-- Select Variant --</option>
                              {availableVariants.map((v: any, vIdx: number) => (
                                <option key={vIdx} value={v.variantName}>{v.variantName} (Stock: {v.stock || 0})</option>
                              ))}
                            </>)}
                        </select>
                      </div>
                      <div className="w-full md:w-24 shrink-0">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Quantity</label>
                        <input type="number" placeholder="1" onWheel={(e) => (e.target as HTMLInputElement).blur()}
                          className="w-full p-2 border border-gray-200 rounded text-sm text-center font-bold h-10 outline-none focus:border-purple-500"
                          value={item.quantity} onChange={(e) => handleComboItemChange(idx, "quantity", e.target.value)} />
                      </div>
                      <button type="button" onClick={() => removeComboItem(idx)}
                        className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-md transition-all shrink-0">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Specifications */}
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><FiList /> Specifications</h2>
              <button type="button" onClick={addSpecification}
                className="px-3 py-1.5 bg-purple-50 text-purple-600 border border-purple-100 rounded text-xs font-bold hover:bg-purple-600 hover:text-white transition-all shadow-sm">
                + Add Row
              </button>
            </div>
            <div className="space-y-2">
              {formData.specifications.map((spec: any, idx: number) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                  <input type="text" placeholder="Key (e.g. Origin)"
                    className="p-2 border border-gray-200 rounded text-sm bg-white outline-none focus:border-purple-500"
                    value={spec.key} onChange={(e) => handleSpecChange(idx, "key", e.target.value)} />
                  <div className="flex gap-2">
                    <input type="text" placeholder="Value"
                      className="flex-1 p-2 border border-gray-200 rounded text-sm bg-white outline-none focus:border-purple-500"
                      value={spec.value} onChange={(e) => handleSpecChange(idx, "value", e.target.value)} />
                    <button type="button" onClick={() => removeSpecification(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== RIGHT SIDEBAR ===== */}
        <div className="lg:col-span-4 space-y-6">

          {/* ✅ Media — বড় করা হয়েছে */}
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
            <h3 className="font-bold text-gray-800 flex items-center gap-2"><FiImage /> Media Assets</h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 block">Thumbnail Image *</label>
              <div className="border-2 border-dashed border-gray-200 rounded-md p-5 text-center bg-gray-50 relative hover:bg-gray-100 transition-colors cursor-pointer">
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={handleThumbnailSelect} />
                <FiImage size={24} className="mx-auto text-gray-300 mb-1" />
                <span className="text-xs text-gray-400">Click to upload main image</span>
              </div>
              {thumbnailPreview && (
                <div className="relative border border-gray-200 rounded-md overflow-hidden bg-gray-50 w-full h-56">
                  <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setThumbnailFile(null); setThumbnailPreview(""); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full">
                    <FiX size={12} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-400 block">Gallery Images</label>
              <div className="border-2 border-dashed border-gray-200 rounded-md p-5 text-center bg-gray-50 relative hover:bg-gray-100 transition-colors cursor-pointer">
                <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={handleGallerySelect} />
                <FiImage size={24} className="mx-auto text-gray-300 mb-1" />
                <span className="text-xs text-gray-400">Click to upload extra images</span>
              </div>
              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {galleryPreviews.map((src, i) => (
                    <div key={i} className="relative group border border-gray-200 rounded-md overflow-hidden aspect-square bg-gray-50">
                      <img src={src} alt="Gallery" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeGalleryImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiX size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-800 flex items-center gap-2"><FiSettings /> Status</h3>
            <select name="status"
              className="w-full p-2.5 border border-gray-200 bg-white text-sm rounded-md outline-none focus:border-[#4F46E5]"
              value={formData.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Promotion */}
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2"><FiSettings /> Promotion</h3>
            {[
              { key: "isFeatured", label: "Featured Product", color: "bg-yellow-500" },
              { key: "isOnSale", label: "On Sale Mode", color: "bg-rose-500" },
              { key: "isNew", label: "New Arrival Badge", color: "bg-emerald-500" },
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50/50 rounded border border-gray-100 cursor-pointer">
                <span className="text-xs font-bold text-gray-600">{item.label}</span>
                <div className="relative">
                  <input type="checkbox" name={item.key} className="sr-only" checked={formData[item.key]} onChange={handleChange} />
                  <div className={`w-10 h-5 rounded-full transition-colors ${formData[item.key] ? item.color : "bg-gray-200"}`}></div>
                  <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-all ${formData[item.key] ? "translate-x-5" : ""}`}></div>
                </div>
              </label>
            ))}
          </div>

          {/* SEO */}
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800">SEO</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400">Meta Title</label>
              <input type="text" name="metaTitle" placeholder="SEO Title"
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none focus:border-[#4F46E5]"
                value={formData.metaTitle} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400">Meta Description</label>
              <textarea name="metaDescription" rows={3} placeholder="SEO Description"
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none focus:border-[#4F46E5]"
                value={formData.metaDescription} onChange={handleChange} />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

const ProductForm = () => (
  <Suspense fallback={<div className="p-20 text-center text-[#4F46E5] font-bold text-sm tracking-widest">LOADING ENGINE...</div>}>
    <ProductFormInner />
  </Suspense>
);

export default ProductForm;