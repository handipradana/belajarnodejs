const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

//membuat koneksi mysql
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'basiccrud'
})

db.connect((err) => {
    console.log('MySQL terkoneksi')
})

app.get('/', (req, res) => {
    db.query('SELECT * FROM tbl_data', (err, result) => {
        // res.send(result)
        res.render('index', {
            data: result
        })
    })
})

app.post('/tambah', (req, res) => {
    const { nama, email, alamat } = req.body;
    const insertQuery = 'INSERT INTO tbl_data (nama, email, alamat) VALUES (?, ?, ?)';
    db.query(insertQuery, [nama, email, alamat], (err, result) => {
        if (err) {
            res.status(500).send('Gagal menyimpan data');
        } else {
            res.status(201).send('Data berhasil disimpan');
        }
    })
})

app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM tbl_data WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error saat mengambil data dari database: ' + err);
            return res.status(500).send('Terjadi kesalahan');
        }
        res.render('edit', { data: result[0] });
    });
});


app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const { nama, email, alamat } = req.body;
    const updateQuery = 'UPDATE tbl_data SET nama = ?, email = ?, alamat = ? WHERE id = ?';
    db.query(updateQuery, [nama, email, alamat, id], (err, result) => {
        if (err) {
            res.status(500).send('Gagal memperbarui data');
        } else {
            res.send('Data berhasil diperbarui');
        }
    });
});

app.get('/add', (req, res) => {
    res.render('add')
})

app.delete('/hapus/:id', (req, res) => {
    const id = req.params.id;
    const deleteQuery = 'DELETE FROM tbl_data WHERE id = ?';
    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            res.status(500).send('Gagal menghapus data');
        } else {
            res.send('Data berhasil dihapus');
        }
    });
});

app.get('/hapus/:id', (req, res) => {
    const id = req.params.id;
    const deleteQuery = 'DELETE FROM tbl_data WHERE id = ?';
    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            res.status(500).send('Gagal menghapus data');
        } else {
            res.send('Data berhasil dihapus');
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000")
})