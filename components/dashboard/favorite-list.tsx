'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable
} from '@dnd-kit/sortable';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { ChevronRightIcon, StarOffIcon } from 'lucide-react';
import { toast } from 'sonner';

import { removeFavorite } from '@/actions/favorites/remove-favorite';
import { reorderFavorites } from '@/actions/favorites/reorder-favorites';
import { ContactAvatar } from '@/components/dashboard/contacts/details/contact-avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { EmptyText } from '@/components/ui/empty-text';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Routes } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { FavoriteDto } from '@/types/dtos/favorite-dto';

export type FavoriteListProps = {
  favorites: FavoriteDto[];
  isCollapsed?: boolean;
};

export function FavoriteList({
  favorites,
  isCollapsed
}: FavoriteListProps): React.JSX.Element {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 8 } })
  );

  const [items, setItems] = React.useState<string[]>(
    favorites.map((favorite) => favorite.id)
  );

  React.useEffect(() => {
    setItems(favorites.map((favorite) => favorite.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites.length]);

  const active = favorites.find((t) => t.id === activeId);

  const handleDragStart = (event: DragStartEvent): void => {
    setActiveId(event.active.id.toString());
  };

  const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id.toString());
      const newIndex = items.indexOf(over.id.toString());

      const oldItems = items.slice();
      const newItems = arrayMove(oldItems.slice(), oldIndex, newIndex);

      setItems(newItems);

      const result = await reorderFavorites({
        favorites: newItems.map((item, index) => ({
          id: item,
          order: index
        }))
      });
      if (result?.serverError || result?.validationErrors) {
        toast.error("Couldn't reorder favorites");
        setItems(oldItems);
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = (): void => {
    setActiveId(null);
  };
  return (
    <Collapsible defaultOpen>
      {!isCollapsed && (
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="group mb-2 h-9 w-full flex-1 items-center justify-between px-3 text-sm text-muted-foreground transition-all [&[data-state=open]>svg]:rotate-90"
          >
            Favorites
            <ChevronRightIcon className="hidden size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:inline" />
          </Button>
        </CollapsibleTrigger>
      )}
      <CollapsibleContent>
        {favorites.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={items}
              strategy={rectSortingStrategy}
            >
              <ul
                role="list"
                className="list-none space-y-1"
              >
                {favorites
                  .slice()
                  .sort((a, b) => items.indexOf(a.id) - items.indexOf(b.id))
                  .map((favorite) => (
                    <React.Fragment key={favorite.id}>
                      {isCollapsed ? (
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger
                            className={
                              isCollapsed
                                ? 'size-9 max-h-9 min-h-9 min-w-9 max-w-9'
                                : 'w-full'
                            }
                          >
                            <SortableFavoriteListItem
                              favorite={favorite}
                              isCollapsed={isCollapsed}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="flex items-center gap-2"
                          >
                            <span>{favorite.name}</span>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <SortableFavoriteListItem
                          favorite={favorite}
                          isCollapsed={isCollapsed}
                        />
                      )}
                    </React.Fragment>
                  ))}
                <DragOverlay adjustScale={true}>
                  {active && (
                    <FavoriteListItem
                      favorite={active}
                      isCollapsed={isCollapsed}
                    />
                  )}
                </DragOverlay>
              </ul>
            </SortableContext>
          </DndContext>
        ) : (
          !isCollapsed && (
            <EmptyText className="ml-3 text-xs">No items added.</EmptyText>
          )
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

type FavoriteListItemElement = HTMLLIElement;
type FavoriteListItemProps = React.HTMLAttributes<HTMLLIElement> & {
  favorite: FavoriteDto;
  isCollapsed?: boolean;
};
const FavoriteListItem = React.forwardRef<
  FavoriteListItemElement,
  FavoriteListItemProps
>(({ favorite, isCollapsed, className, ...other }, ref): React.JSX.Element => {
  const handleRemoveFromFavorites = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    e.stopPropagation();
    e.preventDefault();
    const result = await removeFavorite({ contactId: favorite.contactId });
    if (result?.serverError || result?.validationErrors) {
      toast.error("Couldn't remove favorite");
    }
  };
  return (
    <li
      role="listitem"
      ref={ref}
      className={cn('group relative', className)}
      {...other}
    >
      <DragHandleDots2Icon className="pointer-events-none absolute -left-0.5 top-3 h-3 w-4 shrink-0 opacity-0 group-hover:opacity-60" />
      <Link
        href={`${Routes.Contacts}/${favorite.contactId}`}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'default' }),
          'items-center px-3',
          isCollapsed
            ? 'size-9 max-h-9 min-h-9 min-w-9 max-w-9 justify-center'
            : 'w-full justify-between'
        )}
      >
        <div className="flex flex-row items-center gap-2 overflow-hidden">
          <ContactAvatar
            record={favorite.record}
            src={favorite.image}
          />
          <span
            className={cn(
              'truncate text-sm font-normal',
              isCollapsed && 'sr-only'
            )}
          >
            {favorite.name}
          </span>
        </div>
        {!isCollapsed && (
          <Button
            type="button"
            variant="ghost"
            className="size-6 p-0 text-muted-foreground opacity-0 group-hover:opacity-60"
            onClick={handleRemoveFromFavorites}
          >
            <StarOffIcon className="size-3.5 shrink-0" />
          </Button>
        )}
      </Link>
    </li>
  );
});

function SortableFavoriteListItem(
  props: FavoriteListItemProps
): React.JSX.Element {
  const sortable = useSortable({ id: props.favorite.id });
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = sortable;

  const inlineStyles: React.CSSProperties = {
    transform: transform?.toString(),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <FavoriteListItem
      suppressHydrationWarning
      {...props}
      ref={setNodeRef}
      style={inlineStyles}
      {...attributes}
      {...listeners}
    />
  );
}
