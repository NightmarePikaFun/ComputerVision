using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

using Emgu.CV;
using Emgu.CV.Util;
using Emgu.CV.Structure;

namespace openCV
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            Create();
        }

        public void Create()
        {
            
            Bitmap bmp = new Bitmap("file.bmp");
            Image<Bgr, byte> imgInput = new Image<Bgr, byte>("file.png");
            Image<Gray, byte> grayImg = imgInput.SmoothGaussian(5).Convert<Gray, byte>().PyrUp().PyrDown();
            pictureBox1.Image = bmp;
            VectorOfVectorOfPoint contures = new VectorOfVectorOfPoint();
            Mat hierarchy = new Mat();
            CircleF[] circles = grayImg.HoughCircles(
                new Gray(150),
                new Gray(80),
                1.955865,
                60,
                0,
                0)[0];
            Image<Bgr, byte> imageCircles = imgInput;
            foreach (CircleF circle in circles)
            {
                CircleF circ = new CircleF(circle.Center, 0.01f);
                imageCircles.Draw(circ, new Bgr(Color.White), 101);
            }
            pictureBox2.Image = imageCircles.ToBitmap();
            grayImg = imageCircles.SmoothGaussian(5).Convert<Gray, byte>().PyrUp().PyrDown();
            circles = grayImg.HoughCircles(
                new Gray(12),
                new Gray(6),
                1,
                300,
                0,
                0)[0];
            foreach (CircleF circle in circles)
            {
                CircleF circ = new CircleF(circle.Center, 1f);
                imageCircles.Draw(circ, new Bgr(Color.Black), 290);
            }
            imageCircles._Dilate(5);
            Image<Bgr, byte> testImage = imageCircles.Clone();
            foreach (CircleF circle in circles)
            {
                CircleF circ = new CircleF(circle.Center, 1f);
                imageCircles.Draw(circ, new Bgr(Color.White), 290);
                testImage.Draw(circ, new Bgr(Color.White), 330);
                circ = new CircleF(circle.Center, 160f);
                imageCircles.Draw(circ, new Bgr(Color.White), 2);
            }
            imageCircles._Dilate(2);
            Image<Bgr, byte> redImage = new Image<Bgr, byte>(imageCircles.Width, imageCircles.Height);
            for(int i = 0; i < testImage.Height;i++)
            {
                for(int j = 0; j<testImage.Width;j++)
                {
                    if(testImage[i,j].Red!=imageCircles[i,j].Red && testImage[i, j].Green != imageCircles[i, j].Green && testImage[i, j].Blue != imageCircles[i, j].Blue)
                    {
                        redImage.Draw(new CircleF(new PointF(j, i), 1f), new Bgr(Color.Red), 3);
                    }
                }
            }
            redImage._Erode(5);
            testImage = new Image<Bgr, byte>("file.png");
            for (int i = 0; i<redImage.Height;i++)
            {
                for(int j = 0; j<redImage.Width;j++)
                {
                    if(redImage[i,j].Red!=0)
                    {
                        testImage.Draw(new CircleF(new PointF(j,i),3f), new Bgr(Color.Red), 10);
                    }
                }
            }
            pictureBox1.Image = bmp;
            pictureBox2.Image = testImage.ToBitmap();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Create();
        }
    }
}
