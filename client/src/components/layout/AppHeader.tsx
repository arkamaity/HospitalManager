import { useState } from "react";
import { Bell, ChevronDown, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const AppHeader = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleSidebar = () => {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    if (sidebar) {
      if (sidebar.style.display === 'none' || getComputedStyle(sidebar).display === 'none') {
        sidebar.style.display = 'block';
        sidebar.classList.add('fixed', 'top-14', 'left-0', 'bottom-0', 'z-20');
      } else {
        sidebar.style.display = 'none';
        sidebar.classList.remove('fixed', 'top-14', 'left-0', 'bottom-0', 'z-20');
      }
    }
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            className="lg:hidden mr-2 text-neutral-700" 
            onClick={toggleSidebar}
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="ml-2 text-xl font-heading font-bold text-primary">MediCare</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="relative mr-2">
            <button className="p-2 text-neutral-500 hover:text-neutral-700">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-white text-xs flex items-center justify-center">3</span>
            </button>
          </div>
          <div className="flex items-center border-l border-neutral-200 pl-3 ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center focus:outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2" alt="User profile" />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <div className="ml-2 hidden md:block">
                  <p className="text-sm font-medium text-neutral-700">Dr. Sarah Johnson</p>
                  <p className="text-xs text-neutral-500">Head Physician</p>
                </div>
                <ChevronDown className="ml-2 h-5 w-5 text-neutral-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Notifications</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
