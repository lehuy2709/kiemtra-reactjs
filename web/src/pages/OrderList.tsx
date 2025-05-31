import {
    Table, TableBody, TableCell, TableHead, TableRow,
    Typography, TableContainer, IconButton,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import { useCallback, useEffect, useMemo, useState } from "react"
import { getMethod, postMethod, deleteMethod } from "../utils/api"

interface Order {
    id: number
    date: string
    product_id: number
    quantity: number
    amount: number
}

interface Product {
    id: number
    name: string
    price: number
}

const headers = [
    { name: "id", text: "ID" },
    { name: "product_name", text: "Ten San Pham" },
    { name: "quantity", text: "So Luong" },
    { name: "amount", text: "Tong Tien" },
    { name: "action", text: "Thao tac" }
]

const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [open, setOpen] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [newOrder, setNewOrder] = useState({
        date: "",
        product: null as Product | null,
        quantity: "",
    })

    const getData = async () => {
        try {
            const [productData, orderData] = await Promise.all([
                getMethod("/products"),
                getMethod("/orders")
            ])

            if (orderData && productData) {
                setProducts(productData)

                const formatted = orderData.map((o: any): Order => {
                    const product = productData.find((p: Product) => Number(p.id) === Number(o.product_id))
                    const quantity = Number(o.quantity)
                    const amount = product ? quantity * product.price : Number(o.amount)

                    return {
                        id: Number(o.id),
                        date: o.date,
                        product_id: Number(o.product_id),
                        quantity,
                        amount
                    }
                })

                setOrders(formatted)
            }
        } catch (error) {
            console.log("Loi du lieu:", error)
        }
    }

    const onSave = async () => {
        const { date, product, quantity } = newOrder
        if (!date || !product || !quantity) {
            alert("Nhap du thong tin di!")
            return
        }

        const maxId = Math.max(0, ...orders.map(o => Number(o.id) || 0))
        const id = String(maxId + 1)
        const amount = Number(quantity) * product.price

        const data = await postMethod("/orders", {
            id,
            date,
            product_id: product.id,
            quantity: Number(quantity),
            amount
        })

        if (data) {
            setOrders((prev) => [...prev, {
                ...data,
                amount
            }])
            setOpen(false)
            setNewOrder({ date: "", product: null, quantity: "" })
        }
    }

    const onDelete = useCallback(async (id: number | string) => {
        const ok = await deleteMethod(`/orders/${id}`);
        if (ok) {
            setOrders(prev => prev.filter(o => o.id !== id));
        }
    }, []);

    useEffect(() => {
        getData()
    }, [])

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const product = products.find(p => Number(p.id) === Number(order.product_id));
            return product?.name.toLowerCase().includes(searchText.toLowerCase());
        });
    }, [orders, products, searchText]);

    return (
        <>
            <TableContainer sx={{ mt: 4, p: 2 }}>
                <TextField
                    label="Tim theo ten san pham"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Typography variant="h5" gutterBottom>Danh Sach Don Hang</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{ mb: 2 }}
                >
                    Thêm
                </Button>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headers.map(h => (
                                <TableCell key={h.name}>{h.text}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.map(order => {
                            const product = products.find(p => Number(p.id) === Number(order.product_id))
                            const productName = product ? product.name : "Khong xac dinh"

                            return (
                                <TableRow key={order.id}>
                                    <TableCell>{String(order.id)}</TableCell>
                                    <TableCell>{productName}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>{order.amount}</TableCell>
                                    <TableCell>
                                        <IconButton color="error" onClick={() => onDelete(order.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                <DialogTitle>Them Don Hang</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        type="date"
                        value={newOrder.date}
                        onChange={(e) => setNewOrder({ ...newOrder, date: e.target.value })}
                    />

                    <Autocomplete
                        options={products}
                        getOptionLabel={(option) => `${option.name} (${option.price.toLocaleString()}đ)`}
                        value={newOrder.product}
                        onChange={(e, value) => setNewOrder({ ...newOrder, product: value })}
                        renderInput={(params) => <TextField {...params} label="San Pham" />}
                    />
                    <TextField
                        label="So Luong"
                        type="number"
                        value={newOrder.quantity}
                        onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Huy</Button>
                    <Button variant="contained" onClick={onSave}>Luu</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default OrderList
