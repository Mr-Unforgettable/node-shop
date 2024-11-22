import Image from './Image';
import './Avatar.css';

const avatar = (props: any) => (
  <div
    className="avatar"
    style={{ width: props.size + 'rem', height: props.size + 'rem' }}
  >
    <Image imageUrl={props.image} />
  </div>
);

export default avatar;
