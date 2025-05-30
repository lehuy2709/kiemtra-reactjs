import { useEffect, useState } from "react";
import { deleteMethod, getMethod, postMethod } from "../utils/api";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

interface Product {
    id: number | string,
    name: string,
    price: number,
    remaining: number
}

export default () => {

    const headers = [
        { name: 'id', text: 'ID' },
        { name: 'name', text: 'Ten' },
        { name: 'price', text: 'Gia' },
        { name: 'remaining', text: 'Ton Kho' },
        { name: 'action', text: '' }
    ]
    const [open, setOpen] = useState(false);

    const [products, setProducts] = useState<Product[]>([])
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        remaining: ""
    })

    const onMounted = async () => {
        const productData = await getMethod('/products')
        // @ts-ignore
        setProducts([...productData])
    }

    const onAdd = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.remaining) {
            alert('nhap du thong tin di')
            return false
        }
        const maxId = Math.max(0, ...products.map(p => Number(p.id) || 0))
        const nextId = String(maxId + 1)

        const data = await postMethod("/products", {
            id: nextId,
            name: newProduct.name,
            price: +newProduct.price,
            remaining: +newProduct.remaining
        })

        if (data) {
            setProducts((prd) => [...prd, { ...data, id: Number(data.id) }])
            setNewProduct({
                name: "",
                price: "",
                remaining: ""
            })
            setOpen(false)

        }
    }

    const onDelete = async (id: number | string) => {
        const result = await deleteMethod(`/products/${id}`)
        if (result) {
            setProducts((prd) => prd.filter(pd => pd.id !== id))
        }
    }

    useEffect(() => {
        onMounted()
    }, [])

    return (
        <>

            <TableContainer>
                <Typography>
                    Danh sach san pham
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
                            products.map((product: Product) =>
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
            </Dialog>

        </>




    )
}