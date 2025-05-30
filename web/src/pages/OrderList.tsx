import { useEffect, useState } from "react";
import { deleteMethod, getMethod, postMethod } from "../utils/api";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

interface Order {
    id: number | string,
    date: string,
    product_id: number,
    quantity: number,
    amount: number
}

interface Product {
    id: number | string,
    name: string,
    price: number
}


export default () => {

    const headers = [
        { name: 'id', text: 'ID' },
        { name: 'product_name', text: 'Ten San Pham' },
        { name: 'quantity', text: 'So Luong' },
        { name: 'amount', text: 'Tong Tien' },
        { name: 'action', text: '' }
    ]
    const [open, setOpen] = useState(false);
    const [orders, setOrders] = useState<Order[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [newOrder, setNewOrder] = useState({
        date: "",
        product_id: "",
        quantity: ""
    })


    const getOrders = async () => {
        const [productData,orderData] = await Promise.all([
            getMethod("/products"),
            getMethod("/orders")
        ])
        if(productData){
            setProducts(productData)
        }
        // @ts-ignore
        if (orderData && productData) {
            const data = orderData.map((od: Order) => {
                const product = products.find(prod => prod.id === od.product_id) 
                               
                const quantity = Number(od.quantity)
                let amount
                if (product) {
                    amount = quantity * product.price
                }
                else {
                    amount = +od.amount
                }

                return {
                    id: od.id,
                    date: od.date,
                    product_id: Number(od.product_id),
                    quantity,
                    amount
                }

            })
            setOrders(data)
        }
    }


    useEffect(()=>{
        getOrders()
    },[])

    return (
        <>
            {/* 
            <TableContainer>
                <Typography>
                    Danh sach don hang
                </Typography>

                <Button variant="contained" onClick={() => setOpen(true)} >Them</Button>


                <Table>
                    <TableHead>
                        <TableRow>
                            {
                                headers.map((header) => (
                                    <TableCell key={header.name}>{header.text}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {
                            products.map((product: any) =>
                                // @ts-ignore
                                <TableRow key={product.id}>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.remaining}</TableCell>
                                    <TableCell>
                                        <DeleteIcon color="error" onClick={() => onDelete(product.id)} ></DeleteIcon>
                                    </TableCell>
                                </TableRow>
                            )
                        }

                    </TableBody>

                </Table>

            </TableContainer>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle>Them San Pham Moi</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        label="Ten San Pham"
                        type="text"
                        fullWidth
                        value={newProduct.name}
                        variant="standard"
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />

                    <TextField
                        required
                        label="Gia"
                        type="number"
                        fullWidth
                        value={newProduct.price}
                        variant="standard"
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />

                    <TextField
                        required
                        label="Ton Kho"
                        type="number"
                        fullWidth
                        value={newProduct.remaining}
                        variant="standard"
                        onChange={(e) => setNewProduct({ ...newProduct, remaining: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Huy</Button>
                    <Button variant="contained" onClick={onAdd} >Luu</Button>
                </DialogActions>
            </Dialog> */}

        </>




    )
}