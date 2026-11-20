'use client';

import { fun } from '@/data/portfolio';
import { Photos } from './photos';

/** "Fun" card: hobbies intro + photo gallery. */
const Sports = () => (
  <div className="mx-auto w-full">
    <div className="mb-8">
      <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
        {fun.title}
      </h2>
      <p className="text-muted-foreground mt-4">{fun.intro}</p>
    </div>
    <Photos photos={fun.photos} />
  </div>
);

export default Sports;
