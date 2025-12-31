import Image from 'next/image';

interface StoryCircleProps {
  img: string;
  name: string;
  isLive?: boolean;
}

const StoryCircle = ({ img, name, isLive = false }: StoryCircleProps) => {
  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0 w-20">
        <div className={`story-ring relative ${isLive ? 'p-0.5' : ''}`}>
          <div className="bg-zinc-100 p-1 rounded-full">
            <Image 
              src={img}
              alt={name}
              width={56} 
              height={56}
              className="rounded-full object-cover w-14 h-14"
            />
          </div>
          {isLive && (
            <div className="absolute bottom-0 right-0 bg-red-500 text-white text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full border-2 border-zinc-100">
              LIVE
            </div>
          )}
      </div>
      <p className="text-zinc-800 text-[10px] font-bold text-center truncate w-full">{name}</p>
    </div>
  );
};

export default StoryCircle;
