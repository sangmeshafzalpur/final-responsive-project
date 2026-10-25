# ChilliFusionNet

Hybrid deep learning model for chilli leaf disease detection.

## Model

- EfficientNetB4
- CBAM Attention
- BiLSTM
- Input Size: 380 x 380
- Number of Classes: 5

## Dataset Split

- Training: 70%
- Validation: 15%
- Testing: 15%

## Run Locally

Install dependencies:

pip install -r requirements.txt

Run application:

python app.py

Then open the Flask address shown in the terminal.

## Prediction

Upload a chilli leaf image.

The application returns:

- Predicted disease
- Prediction confidence
- Probability for each class
