interface CardRef {
  id: string;
  header: string;
  img: string;
}

const Card = ({ id, header, img }: CardRef) => {
  return (
    <div className="h-[350px] w-[280px] bg-gray-200 border-4 border-indigo-600 rounded-lg text-black  text-2xl font-bold text-center flex flex-col items-center py-8 px-3 shadow-xl relative">
      <h1> {header} </h1>
      <img
        src={img}
        alt={id}
        width={200}
        height={200}
        className="w-[80%] absolute bottom-8"
      />
    </div>
  );
};

export default Card;
