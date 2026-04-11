from fpdf import FPDF
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOCS_DIR = os.path.join(BASE_DIR, "data", "documents")
os.makedirs(DOCS_DIR, exist_ok=True)

class PDF(FPDF):
    def header(self):
        self.set_font("helvetica", "B", 12)
        # Empty header
        
    def chapter_title(self, title):
        self.set_font("helvetica", "B", 16)
        self.multi_cell(0, 10, title)
        self.ln(5)
        
    def chapter_body(self, body):
        self.set_font("helvetica", "", 12)
        self.multi_cell(0, 8, body)
        self.ln(10)

def create_pdf(filename, title, content):
    pdf = PDF()
    pdf.add_page()
    pdf.chapter_title(title)
    pdf.chapter_body(content)
    pdf.output(os.path.join(DOCS_DIR, filename))
    print(f"Generated {filename}")

# PDF 1: WHO Guidelines
who_content = """World Health Organization (WHO) Guidelines on Mental Health:

1. Mental health is a state of mental well-being that enables people to cope with the stresses of life, realize their abilities, learn well and work well, and contribute to their community. It is an integral component of health and well-being that underpins our individual and collective abilities to make decisions, build relationships and shape the world we live in.
2. Determinants of mental health include individual psychological and biological factors, such as emotional skills, substance use, and genetics. Social, economic, geopolitical, and environmental factors also matter, including poverty, violence, inequality, and environmental deprivation.
3. Psychological first aid is an evidence-based approach for helping people in the immediate aftermath of disaster and terrorism. It involves practical care and support, assessing needs, helping people address basic needs, listening but not pressuring people to talk, and comforting them.
4. Promotion and prevention interventions: Interventions to promote mental well-being and prevent mental disorders involve reducing risks, enhancing resilience, and establishing supportive environments.
"""

# PDF 2: CBT Basics
cbt_content = """Cognitive Behavioral Therapy (CBT) Fundamentals:

Cognitive Behavioral Therapy (CBT) is a form of psychological treatment that has been demonstrated to be effective for a range of problems including depression, anxiety disorders, alcohol and drug use problems, marital problems, eating disorders, and severe mental illness.

Core Principles:
1. Psychological problems are based, in part, on faulty or unhelpful ways of thinking.
2. Psychological problems are based, in part, on learned patterns of unhelpful behavior.
3. People suffering from psychological problems can learn better ways of coping with them, thereby relieving their symptoms and becoming more effective in their lives.

Techniques to change thinking:
- Learning to recognize one's distortions in thinking that are creating problems, and then to reevaluate them in light of reality.
- Gaining a better understanding of the behavior and motivation of others.
- Using problem-solving skills to cope with difficult situations.
- Learning to develop a greater sense of confidence in one's own abilities.
"""

# PDF 3: Breathing and Grounding
grounding_content = """Grounding and Breathing Exercises for Anxiety:

When anxiety peaks, the body's fight-or-flight response activates. The following somatic exercises can help downregulate the nervous system and bring the mind back to the present moment.

1. The 5-4-3-2-1 Grounding Technique:
- Acknowledge 5 things you can see around you.
- Acknowledge 4 things you can touch around you.
- Acknowledge 3 things you can hear.
- Acknowledge 2 things you can smell.
- Acknowledge 1 thing you can taste.

2. Box Breathing (4-4-4-4):
- Inhale slowly through your nose for a count of 4.
- Hold your breath gently for a count of 4.
- Exhale slowly through your mouth for a count of 4.
- Hold the empty breath for a count of 4.
Repeat this cycle at least 4 times to regulate heart rate.

3. Diaphragmatic Breathing (Belly Breathing):
Place one hand on your chest and the other on your belly. Breathe deeply into your belly so that the hand on your belly rises while the hand on your chest remains relatively still.
"""

# PDF 4: Depression Management
depression_content = """Clinical Approaches to Managing Depression:

Depression, or major depressive disorder, is a common and serious medical illness that negatively affects how you feel, the way you think, and how you act.

Behavioral Activation:
One of the core psychological treatments for depression is Behavioral Activation. Depression often leads to isolation and a lack of activity, which further fuels the depressive cycle. Behavioral activation involves scheduling and participating in positive activities, regardless of one's current mood. By engaging in meaningful or enjoyable activities, the brain begins to experience positive reinforcement.

Cognitive Restructuring:
A major component of depression involves the "Cognitive Triad" - negative thoughts about oneself, the world, and the future. Therapy focuses on identifying these absolute cognitive distortions (e.g., "I am worthless," "Things will never improve") and actively reframing them with evidence-based reality checking.

Social Support:
Isolation is both a symptom and a reinforcing mechanism of depression. Building and relying on a supportive community, maintaining regular communication with loved ones, and joining support groups are critical for recovery.
"""

# PDF 5: Handling Grief
grief_content = """Navigating Grief and Loss:

Grief is a natural response to loss. It's the emotional suffering you feel when something or someone you love is taken away.

The Stages of Grief (Kübler-Ross model):
While grief is not strictly linear, people often experience five distinct stages:
1. Denial: "This can't be happening." A defense mechanism that buffers the immediate shock.
2. Anger: "Why is this happening? Who is to blame?" A natural emotional outlet.
3. Bargaining: "Make this not happen, and in return I will..." An attempt to regain control.
4. Depression: "I'm too sad to do anything." A practical realization of the loss.
5. Acceptance: "I'm at peace with what happened." Moving forward with reality.

How to cope:
- Acknowledge your pain.
- Accept that grief can trigger many different and unexpected emotions.
- Understand that your grieving process will be unique to you.
- Seek out face-to-face support from people who care about you.
- Support yourself emotionally by taking care of yourself physically.
"""

create_pdf("WHO_Mental_Health_Guidelines.pdf", "WHO Guidelines on Mental Health", who_content)
create_pdf("CBT_Fundamentals.pdf", "Cognitive Behavioral Therapy (CBT)", cbt_content)
create_pdf("Anxiety_Grounding_Techniques.pdf", "Grounding and Breathing", grounding_content)
create_pdf("Depression_Management.pdf", "Managing Depression", depression_content)
create_pdf("Navigating_Grief.pdf", "Navigating Grief and Loss", grief_content)

print("\nSuccessfully generated 5 comprehensive PDF files in backend/data/documents/")
