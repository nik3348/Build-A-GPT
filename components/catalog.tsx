import styles from '@/styles/Home.module.css';

type Item = {
  title: string;
  img: string;
  price: number;
  rating: number;
  author: string;
}

const Item = (props: { item: Item }) => {
  return (
    <div style={{ flexDirection: 'column', flex: 1 }}>
      <img
        src={`${props.item.img}`}
        alt={props.item.title}
        loading='lazy'
        style={{ maxHeight: '150px' }}
      />
      <h5 style={{ wordWrap: 'break-word' }}>{props.item.title}</h5>
      <h6>{props.item.author}</h6>
      <p>{props.item.rating}/5</p>
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
      rating: 5,
      author: 'Eric Ries'
    },
    {
      title: 'Dust',
      img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1320482392l/72230.jpg',
      price: 2.25,
      rating: 3,
      author: 'Arthur Slade (Goodreads Author)',
    },
    {
      title: 'The C Programming Language. 2nd Edition',
      img: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSvY3i86aRALciRa0pm9ZwxCCkRdqBLoYsJwXkxtHkOIaXQoPnu',
      price: 29.99,
      rating: 3,
      author: 'Brian Kernighan and Dennis Ritchie'
    },
    {
      title: 'Star Trek 101: A Practical Guide to Who, What, Where, and Why',
      img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1348654817l/2128922.jpg',
      price: 6.67,
      rating: 4,
      author: 'Terry J. Erdmann'
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
