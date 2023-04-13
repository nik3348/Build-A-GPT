import styles from '@/styles/Home.module.css';
import { grey } from '@mui/material/colors';

type Item = {
  title: string;
  img: string;
  price: number;
  author: string;
}

const Item = (props: { item: Item }) => {
  return (
    <div className={styles.items}>
      <img
        src={`${props.item.img}`}
        alt={props.item.title}
        loading='lazy'
        style={{ maxHeight: '200px', marginBottom: '20px' }}
      />
      <h2 className={styles.text}>{props.item.title}</h2>
      <h4 className={styles.text}>{props.item.author}</h4>
      <p>RM {props.item.price}</p>
    </div>
  )
}

const Catalog = () => {
  const items: Item[] = [
    {
      title: 'The Lean Startup',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51Zymoq7UnL._AC_SY400_.jpg',
      price: 29.99,
      author: 'Eric Ries'
    },
    {
      title: 'Dust',
      img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1320482392l/72230.jpg',
      price: 2.25,
      author: 'Arthur Slade (Goodreads Author)',
    },
    {
      title: 'Рубашка',
      img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1187031995l/1695654.jpg',
      price: 5.99,
      author: 'Евгений Гришковец'
    },
    {
      title: 'Schattenerwachen',
      img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1452464300l/28393353.jpg',
      price: 2.86,
      author: 'Maya Shepherd (Goodreads Author)'
    },
  ]

  return (
    <div className={styles.catalog}>
      <h1>TRENDING BOOKS</h1>
      <div className={styles.catalogItems}>
        {items.map((item, index) => (
          <Item key={index} item={item} />
        ))}
      </div>
    </div>
  )
}

export default Catalog
