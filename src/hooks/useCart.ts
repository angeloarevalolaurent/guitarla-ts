import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db"
import type { Guitar, CartItem } from '../types';

export default function useCart() {

    // Función para obtener el carrito inicial desde localStorage
        const initialCart = () : CartItem[] => {
            const localStorageCart = localStorage.getItem('cart');
            return localStorageCart ? JSON.parse(localStorageCart) : [];
        };
    
    
     // Estado Global
        const [data] = useState(db)
        const [cart, setCart] = useState(initialCart)
    
        // Límite máximo y minimo de items en el carrito
        const MAX_ITEMS = 5;
        const MIN_ITEMS = 1;
    
    // Guardar el carrito en localStorage cada vez que cambie
        useEffect(() => {
          localStorage.setItem('cart', JSON.stringify(cart));
        }, [cart]);  
    
        // Agregar un item al carrito
        function addToCart(item : Guitar) {
    
            const itemExists = cart.findIndex(guitar => guitar.id === item.id);
    
            if (itemExists >= 0) { // existe en el carrito
               if (cart[itemExists].quantity >= MAX_ITEMS) return; // Si se alcanza el límite máximo, no se agrega
               
                // Si el item ya existe en el carrito, no lo agregamos
                const updatedCart = [...cart]
                updatedCart[itemExists].quantity++
                setCart(updatedCart);
            } else {
                const newItem: CartItem = { ...item, quantity: 1 };
                setCart([...cart, newItem])
            }
        }
    
        // Eliminar un item del carrito
        function removeFromCart(id : Guitar['id']) {
            setCart(prevCart => prevCart.filter(guitar => guitar.id !== id));       
        }
    
        // Aumentar la cantidad de un item en el carrito
        function increaseQuantity(id : Guitar['id']) {
            const updatedCart = cart.map(item => { 
                if (item.id === id && item.quantity < MAX_ITEMS) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });
            setCart(updatedCart);       
        }
    
    
        // Disminuir la cantidad de un item en el carrito
        function decreaseQuantity(id : Guitar['id']) {
            const updatedCart = cart.map(item => { 
                if (item.id === id && item.quantity > MIN_ITEMS) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            });
            setCart(updatedCart);
         }
    
    // Vaciar el carrito
         function clearCart() {
            setCart([]);
         }
    


    //State Derivado
    const isEmpty = useMemo(() => cart.length === 0, [cart]);
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart]);
     
    return {

        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }    
}

