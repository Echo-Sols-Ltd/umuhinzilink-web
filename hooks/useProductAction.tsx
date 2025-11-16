import { useToast } from "@/components/ui/toast/Toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProduct } from "@/contexts/ProductContext";
import { productService } from "@/services/products";
import { FarmerProductRequest, SupplierProductRequest } from "@/types";
import { router } from "expo-router";
import { useState } from "react";

export default function useProductAction() {
    const { showToast } = useToast()
    const { user } = useAuth()
    const { addFarmerProduct, addSupplierProduct, updateFarmerProduct, updateSupplierProduct } = useProduct()
    const [loading, setLoading] = useState(false)


    const createFarmerProduct = async (payload: FarmerProductRequest) => {
        try {
            setLoading(true);

            const res = await productService.createFarmerProduct(payload);

            if (!res) {
                showToast({
                    title: "Failed to Create product",
                    description: "Try again later",
                    type: 'error'
                })
                return;
            }

            if (!res.success) {
                showToast({
                    title: "Failed to Create product",
                    description: "Try again later",
                    type: 'error'
                })
                return;
            }

            const newProduct = res.data;
            if (!newProduct) {
                showToast({
                    title: "Failed to Create product",
                    description: "Try again later",
                    type: 'error'
                })
                return;
            }

            addFarmerProduct(newProduct)
            router.push('/')
            showToast({
                title: "Product created",
                description: "Product created successfully",
                type: 'default'
            })
        } catch {
            showToast({
                title: "Failed to Create product",
                description: "Try again later",
                type: 'error'
            })
        } finally {
            setLoading(false);
        }
    };

    const createSupplierProduct = async (payload: SupplierProductRequest) => {
        try {
            setLoading(true);

            const res = await productService.createSupplierProduct(payload);

            if (!res) {
                showToast({
                    title: "Failed to Create product",
                    description: "Try again later",
                    type: 'error'
                })
                return;
            }

            if (!res.success) {
                showToast({
                    title: "Failed to Create product",
                    description: "Try again later",
                    type: 'error'
                })
                return;
            }

            const newProduct = res.data;
            if (!newProduct) {
                showToast({
                    title: "Failed to Create product",
                    description: "Try again later",
                    type: 'error'
                })
                return;
            }

            addSupplierProduct(newProduct)
            router.push('/')

            showToast({
                title: "Product created",
                description: "Product created successfully",
                type: 'default'
            })
        } catch {
            showToast({
                title: "Failed to Create product",
                description: "Try again later",
                type: 'error'
            })
        } finally {
            setLoading(false);
        }
    };

    const editFarmerProduct = async (id: string, payload: FarmerProductRequest) => {
        try {
            setLoading(true);

            const res = await productService.updateFarmerProduct(id, payload);

            if (!res) {
                showToast({
                    title: "Failed to Edit product",
                    description: "Try again later",
                    type: 'error'
                })
                return;
            }

            if (!res.success) {
                showToast({
                    title: "Failed to Edit product",
                    description: "Try again later",
                    type: 'error'
                })
                return;
            }

            const updatedProduct = res.data;
            if (!updatedProduct) {
                showToast({
                    title: "Failed to Edit product",
                    description: "Try again later",
                    type: 'error'
                })
                return;
            }

            updateFarmerProduct(updatedProduct.id, updatedProduct)

            showToast({
                title: "Product edited",
                description:'The product was updated successfully',
                type: 'default'
            })
            router.back()
        } catch {
            showToast({
                title: "Failed to Edit product",
                description: "Try again later",
                type: 'error'
            })
        } finally {
            setLoading(false);
        }
    };

    const editSupplierProduct = async (id: string, payload: SupplierProductRequest) => {
        try {
            setLoading(true);

            const res = await productService.updateSupplierProduct(id, payload);

            if (!res) {
                showToast({
                    title: "Failed to Edit product",
                    description: "Try again later",
                    type: 'error'
                })
                return;
            }

            if (!res.success) {
                showToast({
                    title: "Failed to Edit product",
                    description: "Try again later",
                    type: 'error'
                })
                return;
            }

            const updatedProduct = res.data;
            if (!updatedProduct) {
                showToast({
                    title: "Failed to Edit product",
                    description: "Try again later",
                    type: 'error'
                })
                return;
            }
            updateSupplierProduct(updatedProduct.id, updatedProduct)


            router.back()

            showToast({
                title: "Product edited",
                type: 'default'
            })
        } catch {
            showToast({
                title: "Failed to Edit product",
                description: "Try again later",
                type: 'error'
            })
        } finally {
            setLoading(false);
        }
    };

    const deleteFarmerProduct = async (id: string) => {
        try {
            setLoading(true);

            const res = await productService.deleteFarmerProduct(id);

            if (!res) {
                showToast({
                    title: "Failed to delete product",
                    description: "Try again later",
                    type: 'error'
                })
                return;
            }

            if (!res.success) {
                showToast({
                    title: "Failed to delete product",
                    description: "Try again later",
                    type: 'error'
                })
                return;
            }
            router.back()

        } catch {
            showToast({
                title: "Failed to delete product",
                description: "Try again later",
                type: 'error'
            })
        } finally {
            setLoading(false);
        }
    };

    const deleteSupplierProduct = async (id: string) => {
        try {
            setLoading(true);

            const res = await productService.deleteSupplierProduct(id);

            if (!res) {
                showToast({
                    title: "Failed to delete product",
                    description: "Try again later",
                    type: 'error'
                })
                return;
            }

            if (!res.success) {
                showToast({
                    title: "Failed to delete product",
                    description: "Try again later",
                    type: 'error'
                })
                return;
            }

            router.back()

        } catch {
            showToast({
                title: "Failed to delete product",
                description: "Try again later",
                type: 'error'
            })
        } finally {
            setLoading(false);
        }
    };


    return {
        createFarmerProduct,
        createSupplierProduct,
        editFarmerProduct,
        editSupplierProduct,
        deleteFarmerProduct,
        deleteSupplierProduct,
        loading
    }

}