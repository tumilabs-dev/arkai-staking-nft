import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../animate-ui/components/radix/popover";
import { BellIcon } from "../icons/bell.icon";
import { RewardIcon } from "../icons/reward.icon";

const demoNotifications = [
  {
    type: "rewards",
    title: "VIP 1 Pool",
    description: "New week has started, claim your rewards now!",
    createdAt: new Date(),
    isRead: false,
  },
  {
    type: "rewards",
    title: "VIP 2 Pool",
    description: "New week has started, claim your rewards now!",
    createdAt: new Date(),
    isRead: true,
  },
];

export function Notification() {
  return (
    <Popover>
      <PopoverTrigger>
        <BellIcon />
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start">
        <div className="flex flex-col py-2">
          {demoNotifications.map((notification) => (
            <div
              key={notification.title}
              className="cursor-pointer flex gap-2 px-2 py-2 hover:bg-accent/10 transition-all duration-300"
            >
              <RewardIcon className="text-primary-500 size-6" />

              <div className="">
                <h2 className="text-sm font-medium">{notification.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
