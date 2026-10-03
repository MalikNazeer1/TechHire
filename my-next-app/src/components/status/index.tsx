"use client";

import { useContext } from "react";
import { UsersStateContext } from "@/contexts/users-settings";
// import { useUser } from "@/contexts/UserContext";
import { useSession } from "next-auth/react";

const Status = ({ muted, visible }: { muted: boolean; visible: boolean }) => {
  const { data: session } = useSession();
  const user = session;
  // const { user } = useUser();
  const { streams, avatars, isMuted, isHidden, names } =
    useContext(UsersStateContext);
  const usersEntries = Object.entries(streams);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="mb-4 pb-4 border-b border-slate-700">
        <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">
          {usersEntries.length + 1} Participants
        </h3>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {/* Current User */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
          {user?.image ? (
            <img
              className="rounded-full w-10 h-10 ring-2 ring-indigo-500/50"
              src={user.image}
              alt="Your avatar"
            />
          ) : (
            <div className="rounded-full w-10 h-10 bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
              U
            </div>
          )}
          <div className="flex-1">
            <p className="font-semibold text-white text-sm">You</p>
            <p className="text-xs text-slate-400">(Host)</p>
          </div>
          <div className="flex gap-2">
            <div title={muted ? "Muted" : "Unmuted"} className="text-slate-400 hover:text-white transition-colors">
              {muted ? (
                <Icon type="muted" w={4} h={4} />
              ) : (
                <Icon type="not-muted" w={4} h={4} />
              )}
            </div>
            <div title={!visible ? "Camera off" : "Camera on"} className="text-slate-400 hover:text-white transition-colors">
              {!visible ? (
                <Icon type="not-visible" w={4} h={4} />
              ) : (
                <Icon type="visible" w={4} h={4} />
              )}
            </div>
          </div>
        </div>

        {/* Other Participants */}
        {usersEntries.map(([id]) => (
          <div
            key={id}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
          >
            {avatars[id] ? (
              <img
                className="rounded-full w-10 h-10 ring-2 ring-purple-500/50"
                src={avatars[id]}
                alt={names[id] || "Participant"}
              />
            ) : (
              <div className="rounded-full w-10 h-10 bg-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {names[id]?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-slate-100 text-sm">{names[id]}</p>
              <p className="text-xs text-slate-500">(Participant)</p>
            </div>
            <div className="flex gap-2">
              <div title={isMuted[id] ? "Muted" : "Unmuted"} className="text-slate-400 hover:text-white transition-colors">
                {isMuted[id] ? (
                  <Icon type="muted" w={4} h={4} />
                ) : (
                  <Icon type="not-muted" w={4} h={4} />
                )}
              </div>
              <div title={isHidden[id] ? "Camera off" : "Camera on"} className="text-slate-400 hover:text-white transition-colors">
                {isHidden[id] ? (
                  <Icon type="not-visible" w={4} h={4} />
                ) : (
                  <Icon type="visible" w={4} h={4} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Status;

const icons = {
  "not-muted": (
    <>
      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
      <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
    </>
  ),
  muted: (
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
  ),
  visible: (
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
  ),
  "not-visible": (
    <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.5 17.69c0 .471-.202.86-.504 1.124l-4.746-4.746V7.939l2.69-2.689c.944-.945 2.56-.276 2.56 1.06v11.38zM15.75 7.5v5.068L7.682 4.5h5.068a3 3 0 013 3zM1.5 7.5c0-.782.3-1.494.79-2.028l12.846 12.846A2.995 2.995 0 0112.75 19.5H4.5a3 3 0 01-3-3v-9z" />
  ),
};

const Icon = ({
  type,
  w = 5,
  h = 5,
}: {
  type: keyof typeof icons;
  w?: number;
  h?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-${w} h-${h}`}
  >
    {icons[type]}
  </svg>
);
