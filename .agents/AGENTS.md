# Zizu Facture - UI/UX Design System Guidelines

All new components and pages MUST follow this precise design system established in the Dashboard:

## 1. Aesthetic & Style
- **Vibe**: Premium, modern, and clean SaaS interface.
- **Glassmorphism**: Use `bg-white/80 backdrop-blur-md` for sticky headers or floating elements.
- **Gradients**: Use `bg-gradient-to-r from-indigo-600 to-purple-600` for primary branding, important text, and primary actions.
- **Shadows**: Use soft shadows `shadow-sm` on structural elements (like sidebar/header), and `shadow-soft` (or `shadow-md`) on content cards.

## 2. Shapes & Borders
- **Cards & Containers**: Highly rounded corners using `rounded-2xl`. No heavy borders; use `border-0` or very subtle `border border-slate-50` / `border-slate-100`.
- **Buttons & Badges**: Use `rounded-full` for primary/secondary buttons and status badges.
- **Interactive Elements**: Use `rounded-xl` for sidebar items and smaller interactive elements.

## 3. Animations & Interactions (Crucial)
- **Cards**: All data cards must have hover effects: `hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`.
- **Icons**: Sidebar or interactive icons should slightly scale on hover: `transition-transform duration-200 group-hover:scale-110`.
- **Row Actions**: Table row actions should appear on hover: `opacity-0 group-hover:opacity-100 transition-opacity`.
- **Buttons**: Subtle scaling on primary buttons: `hover:scale-[1.02] transition-all`.

## 4. Colors & Typography
- **Headings**: `text-slate-900` with `font-bold` and `tracking-tight`.
- **Secondary Text**: `text-slate-500` or `text-slate-600` with `font-medium`.
- **Status Badges**: Soft background matching text (e.g., `bg-emerald-50 text-emerald-600 border border-emerald-200`). Never use plain solid colors for badges.

## 5. Spacing & Alignments
- **Cards**: Standard padding of `p-6` (or `p-5` for headers).
- **Flex/Grid Layouts**: Use `gap-6` for card grids and `gap-4` for flex alignments.
- **Lists/Menus**: Use generous vertical spacing `space-y-3` or `space-y-2`. Ensure touch targets on mobile have enough padding (`py-3` or `py-3.5`).

## 6. Responsiveness
- **Grids**: Always use responsive grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`.
- **Sidebars**: Hide on mobile (`hidden md:flex`) and provide a `Sheet` (Drawer) menu for mobile navigation.
- **Widths**: Mobile drawers should use relative sizing with boundaries `w-[85vw] max-w-[320px] sm:w-80`.
- **Padding**: Adjust padding responsively (e.g., `px-4 sm:px-6 md:px-8` for page containers).
