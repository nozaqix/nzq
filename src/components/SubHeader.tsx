export default function SubHeader() {
  return (
    <div className="space-y-2.5 text-xs text-[#B8B9BA] font-normal leading-normal tracking-[0.6px] font-din-next">
      <div>
        <span>Name</span>
        <span>{' : '}</span>
        <span>{'nozaqi'}</span>
      </div>
      <div>
        <span>Role</span>
        <span>{' : '}</span>
        <span>{'Composer'}</span>
      </div>
      <div>
        <span>Works</span>
        <span>{' : '}</span>
        <span>
          {'Compose | Arrangement | Lyric | Mix | Mastering'}
        </span>
      </div>
      <div>
        <span>Skills</span>
        <span>{' : '}</span>
        <span>
          {'Compose | Graphic Design | Interface Design | Visual Architect | Development | etc...'}
        </span>
      </div>
    </div>
  );
}

