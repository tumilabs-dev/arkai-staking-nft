import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/animate-ui/components/radix/accordion";
import SpiralPadPattern from "@/components/ui/SpiralPadPattern";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/rules/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-background min-h-[calc(100vh-10rem)]">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center py-8 text-muted-foreground">
          Rules
        </h1>

        <div className="w-full">
          <SpiralPadPattern />
          <Accordion type="multiple" defaultValue={["rule-1"]}>
            {Array.from({ length: 4 }).map((_, index) => (
              <AccordionItem
                value={`rule-${index + 1}`}
                className="bg-white mb-2"
              >
                <AccordionTrigger className="text-xl px-4 border-b border-black/10">
                  Potential Reward Overview {index + 1}
                </AccordionTrigger>
                <AccordionContent className="p-4 text-lg text-black/80">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                  Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
                  natoque penatibus et magnis dis parturient montes, nascetur
                  ridiculus mus. Donec quam felis, ultricies nec, pellentesque
                  eu, pretium quis, sem. Nulla consequat massa quis enim. 
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <SpiralPadPattern />
        </div>
      </div>
    </div>
  );
}
