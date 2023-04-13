import MCarousel from 'react-material-ui-carousel';
import { Button, Paper } from '@mui/material';
import styles from '@/styles/Home.module.css';

interface Item {
  name: string;
  description: string;
}

const Item = (props: { item: Item }) => {
  return (
    <Paper>
      <div className={styles.carouselItem}>
        <h2>{props.item.name}</h2>
        <p>{props.item.description}</p>

        <Button>
          Check it out!
        </Button>
      </div>
    </Paper>
  )
}

const Carousel = () => {
  const items: Item[] = [
    {
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!"
    },
    {
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
