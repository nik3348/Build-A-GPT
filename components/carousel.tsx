import MCarousel from 'react-material-ui-carousel';
import { Button, Paper } from '@mui/material';
import styles from '@/styles/Home.module.css';

interface Item {
  img: string;
  name: string;
  description: string;
}

const Item = (props: { item: Item }) => {
  return (
    <Paper>
      <div className={styles.carouselItem}>
        <img src={props.item.img} alt="Random" style={{ maxHeight: '100%' }} />
      </div>
    </Paper>
  )
}

const Carousel = () => {
  const items: Item[] = [
    {
      img: "https://images.pexels.com/photos/3728084/pexels-photo-3728084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!"
    },
    {
      img: "https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg",
      name: "Random Name #2",
      description: "Hello World!"
    }
  ]

  return (
    <MCarousel className={styles.carousel}>
      {
        items.map((item, i) => <Item key={i} item={item} />)
      }
    </MCarousel>
  )
}

export default Carousel;
